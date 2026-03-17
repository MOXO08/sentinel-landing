const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SENTINEL_API_KEY = process.env.SENTINEL_API_KEY;
const DAILY_LIMIT = 100;
const BATCH_SIZE = 20;
const TEMP_DIR = path.join(__dirname, 'discovery_temp');
const REPO_SIZE_LIMIT_KB = 200 * 1024; // 200MB limit

const RUN_ID = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// --- Helpers ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDirSize(dirPath) {
    let size = 0;
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            size += getDirSize(filePath);
        } else {
            size += stats.size;
        }
    }

    return size;
}

async function githubApiRequest(apiPath) {
    const url = `https://api.github.com${apiPath}`;

    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Sentinel-Discovery-Engine',
                'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined
            }
        };

        https.get(url, options, (res) => {
            const remaining = parseInt(res.headers['x-ratelimit-remaining'] || '100', 10);
            const resetTime = parseInt(res.headers['x-ratelimit-reset'] || '0', 10) * 1000;

            if (res.statusCode === 403 && remaining === 0) {
                const waitTime = Math.max(0, resetTime - Date.now()) + 1000;
                console.warn(`[Discovery] Rate limit hit. Cooling down for ${Math.ceil(waitTime / 60000)} mins...`);
                return resolve({ rateLimited: true, waitTime });
            }

            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`GitHub API error: ${res.statusCode} ${data}`));
                }

                try {
                    resolve({ data: JSON.parse(data) });
                } catch (err) {
                    reject(new Error(`Failed to parse GitHub API response: ${err.message}`));
                }
            });
        }).on('error', reject);
    });
}

function detectEvidence(repoPath) {
    const evidence = {
        files: [],
        dependencies: [],
        keywords: [],
        flags: [],
        passedRules: [],
        failedRules: [],
        detectedSignals: [],
        missingSignals: []
    };

    const repoName = path.basename(repoPath);
    const readmePath = path.join(repoPath, 'README.md');
    const readmeContent = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8').toLowerCase() : '';

    // 1. Documentation & Transparency (EUAI-DOC)
    const hasTechnicalDocs = fs.existsSync(path.join(repoPath, 'docs')) || readmeContent.length > 2000;
    const hasUsageDisclosure = readmeContent.includes('usage') || readmeContent.includes('how to use') || readmeContent.includes('getting started');
    const hasModelCard = fs.existsSync(path.join(repoPath, 'model-card.md')) || readmeContent.includes('model card');

    if (hasModelCard) {
        evidence.passedRules.push('EUAI-DOC-001');
        evidence.detectedSignals.push('Model Card / Technical File (Art. 13)');
    } else {
        evidence.failedRules.push('EUAI-DOC-001');
        evidence.missingSignals.push('Model Card / Technical File (Art. 13)');
    }

    if (hasUsageDisclosure) {
        evidence.passedRules.push('EUAI-DOC-002');
    } else {
        evidence.failedRules.push('EUAI-DOC-002');
        evidence.missingSignals.push('Technical Usage Disclosure');
    }

    // 2. Data & Provenance (EUAI-DATA)
    const hasDatasetRefs = readmeContent.includes('dataset') || readmeContent.includes('data source') || fs.existsSync(path.join(repoPath, 'dataset-card.md'));
    const hasProvenance = readmeContent.includes('provenance') || readmeContent.includes('curation') || readmeContent.includes('training data');

    if (hasDatasetRefs || hasProvenance) {
        evidence.passedRules.push('EUAI-DATA-001');
        evidence.detectedSignals.push('Dataset Provenance / Training Logs (Art. 10)');
    } else {
        evidence.failedRules.push('EUAI-DATA-001');
        evidence.missingSignals.push('Dataset Provenance / Training Logs (Art. 10)');
    }

    // 3. Risk & Governance (EUAI-RISK / EUAI-GOV)
    const hasRiskDocs = readmeContent.includes('risk') || readmeContent.includes('mitigation') || fs.existsSync(path.join(repoPath, 'audit'));
    const hasGovDocs = fs.existsSync(path.join(repoPath, 'GOVERNANCE.md')) || readmeContent.includes('governance') || readmeContent.includes('policy');

    if (hasRiskDocs) {
        evidence.passedRules.push('EUAI-RISK-001');
        evidence.detectedSignals.push('Risk Assessment / Mitigation Policy (Art. 9)');
    } else {
        evidence.failedRules.push('EUAI-RISK-001');
        evidence.missingSignals.push('Risk Assessment / Mitigation Policy (Art. 9)');
    }

    if (hasGovDocs) {
        evidence.passedRules.push('EUAI-GOV-001');
        evidence.detectedSignals.push('Governance Framework / Policy (Art. 10)');
    } else {
        evidence.failedRules.push('EUAI-GOV-001');
        evidence.missingSignals.push('Governance Framework / Policy (Art. 10)');
    }

    // 4. Privacy (EUAI-PRIVACY)
    const hasPrivacy = fs.existsSync(path.join(repoPath, 'PRIVACY.md')) || readmeContent.includes('privacy') || readmeContent.includes('data handling');
    if (hasPrivacy) {
        evidence.passedRules.push('EUAI-PRIVACY-001');
        evidence.detectedSignals.push('Privacy Policy / Data Handling (GDPR)');
    } else {
        evidence.failedRules.push('EUAI-PRIVACY-001');
        evidence.missingSignals.push('Privacy Policy / Data Handling (GDPR)');
    }

    // 5. Positive Evidence (EUAI-EVIDENCE)
    if (fs.existsSync(path.join(repoPath, 'LICENSE'))) {
        evidence.passedRules.push('EUAI-EVIDENCE-001');
        evidence.detectedSignals.push('LICENSE');
        evidence.files.push('LICENSE');
    }

    const ciPath = path.join(repoPath, '.github/workflows');
    if (fs.existsSync(ciPath)) {
        evidence.passedRules.push('EUAI-EVIDENCE-002');
        evidence.detectedSignals.push('CI workflow');
        evidence.files.push('.github/workflows');
    }

    const hasSarif = fs.readdirSync(repoPath).some(f => f.endsWith('.sarif'));
    if (hasSarif) {
        evidence.passedRules.push('EUAI-EVIDENCE-003');
        evidence.detectedSignals.push('SARIF Artifact');
    }

    // Dependency Analysis
    const pkgPath = path.join(repoPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
            const aiLibs = ['openai', 'langchain', 'transformers', 'torch', 'tensorflow', 'scikit-learn', 'anthropic', 'pinecone', 'llama-index'];
            evidence.dependencies.push(...aiLibs.filter(lib => allDeps[lib]));
        } catch (e) {}
    }

    evidence.flags = evidence.passedRules;
    return evidence;
}

function calculateScore(evidence) {
    let score = 100;
    let breakdown = {
        base: 100,
        deductions: [],
        bonuses: []
    };

    const criticalAbsence = ['EUAI-DOC-001', 'EUAI-DATA-001', 'EUAI-RISK-001'];
    criticalAbsence.forEach(rule => {
        if (evidence.failedRules.includes(rule)) {
            score -= 20;
            breakdown.deductions.push({ rule, penalty: 20, reason: 'Missing critical compliance signal' });
        } else if (evidence.passedRules.includes(rule)) {
            breakdown.bonuses.push({ rule, bonus: 5, reason: 'Verified technical manifest' });
            score += 5;
        }
    });

    const standardAbsence = ['EUAI-DOC-002', 'EUAI-GOV-001', 'EUAI-PRIVACY-001'];
    standardAbsence.forEach(rule => {
        if (evidence.failedRules.includes(rule)) {
            score -= 10;
            breakdown.deductions.push({ rule, penalty: 10, reason: 'Missing standard documentation' });
        }
    });

    if (evidence.passedRules.includes('EUAI-EVIDENCE-002')) {
        score += 5;
        breakdown.bonuses.push({ reason: 'CI/CD pipeline detected', bonus: 5 });
    }

    score = Math.min(100, Math.max(10, score));
    return { score, breakdown };
}

// --- Implementation ---
async function searchRepositories(query) {
    const res = await githubApiRequest(
        `/search/repositories?q=${encodeURIComponent(query)}&sort=updated&per_page=${BATCH_SIZE}`
    );

    if (res.rateLimited) {
        await sleep(res.waitTime);
        return searchRepositories(query);
    }

    return res.data.items;
}

async function processRepository(repo) {
    if (repo.size > REPO_SIZE_LIMIT_KB) {
        console.log(
            `[Discovery] Skipping ${repo.full_name}: Too large (${repo.size}KB > ${REPO_SIZE_LIMIT_KB}KB)`
        );
        return;
    }

    const repoPath = path.join(TEMP_DIR, repo.name);
    console.log(`\n[Discovery] Processing: ${repo.full_name} (${repo.stargazers_count} stars)`);

    try {
        if (fs.existsSync(repoPath)) {
            fs.rmSync(repoPath, { recursive: true, force: true });
        }

        execSync(`git clone --depth=1 ${repo.clone_url} ${repoPath}`, { timeout: 60000 });

        const manifestCandidates = [
            'manifest.json',
            'sentinel.manifest.json',
            'ai-manifest.json'
        ];

        const foundManifest = manifestCandidates
            .map(name => path.join(repoPath, name))
            .find(candidatePath => fs.existsSync(candidatePath));

        let scanTarget;

        if (foundManifest) {
            scanTarget = `"${foundManifest}"`;
            console.log(`[Discovery] Found manifest for ${repo.name}: ${path.basename(foundManifest)}`);

            const policyPath = path.join(repoPath, 'sentinel.policy.json');
            if (!fs.existsSync(policyPath)) {
                const policy = {
                    policy_version: '1.0',
                    mode: 'discovery',
                    ruleset: 'baseline'
                };
                fs.writeFileSync(policyPath, JSON.stringify(policy, null, 2));
                console.log(`[Discovery] Generated temporary policy for ${repo.name}.`);
            }
        } else {
            console.log(`[Discovery] No supported manifest found for ${repo.name}. Generating auto manifest.`);

            const evidence = detectEvidence(repoPath);
            const autoManifestPath = path.join(repoPath, 'sentinel.auto.manifest.json');
            
            const autoManifest = {
                project: repo.name,
                discovery_mode: true,
                repository: repo.html_url,
                generated_by: 'sentinel-discovery-engine',
                ai_stack_evidence: evidence.dependencies,
                declared_flags: evidence.flags,
                detected_artifacts: evidence.files
            };
            
            fs.writeFileSync(autoManifestPath, JSON.stringify(autoManifest, null, 2));

            const policyPath = path.join(repoPath, 'sentinel.policy.json');
            const policy = {
                policy_version: '1.0',
                mode: 'discovery',
                ruleset: 'baseline'
            };
            fs.writeFileSync(policyPath, JSON.stringify(policy, null, 2));

            scanTarget = `"${autoManifestPath}"`;
            repo._discoveryEvidence = evidence; // Store for later reporting
        }

        const scanCmd = `npx @radu_api/sentinel-scan ${scanTarget} --json --baseline`;

        console.log(`[Discovery] Running Sentinel audit on ${repo.name}...`);
        let output;

        try {
            output = execSync(scanCmd, {
                encoding: 'utf8',
                cwd: repoPath,
                stdio: ['pipe', 'pipe', 'pipe']
            });
        } catch (err) {
            output = err.stdout ? err.stdout.toString() : "";
        }

        let auditData;
        try {
            auditData = JSON.parse(output);
        } catch (e) {
            console.error(`[Discovery] Failed to parse scanner output: ${e.message}`);
            return;
        }

        // Final Evidence Aggregation
        const finalEvidence = repo._discoveryEvidence || detectEvidence(repoPath);
        const { score, breakdown } = calculateScore(finalEvidence);

        const violations = finalEvidence.failedRules;
        const passedRules = finalEvidence.passedRules;

        // Align risk level with compliance_status and score
        let risk_level = 'Low';
        if (score < 60) {
            risk_level = 'High';
        } else if (score < 85) {
            risk_level = 'Medium';
        }

        const slug =
            repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-') +
            '-' +
            Math.random().toString(36).substring(2, 5);

        // Repo-specific technical summary generation
        let summary_text = "";
        if (finalEvidence.missingSignals.length === 0) {
            summary_text = `Autonomous technical mapping identifies that ${repo.name} aligns with visible AI compliance patterns, including verified documentation and CI/CD artifacts.`;
        } else if (finalEvidence.detectedSignals.length > 0) {
            summary_text = `Technical evidence for ${repo.name} indicates signs of ${finalEvidence.detectedSignals.slice(0, 2).join(' and ')}. However, gaps remain for ${finalEvidence.missingSignals.slice(0, 2).join(', ')}.`;
        } else {
            summary_text = `Technical assessment of ${repo.name} indicates restricted public compliance evidence. Specifically, ${finalEvidence.missingSignals[0]} was not detected in the repository root.`;
        }

        // Categorization logic
        const dependencies = finalEvidence.dependencies || [];
        const categories = new Set();
        if (dependencies.includes('openai') || dependencies.includes('anthropic')) categories.add('openai');
        if (dependencies.includes('langchain')) categories.add('langchain');
        if (dependencies.includes('pinecone') || dependencies.includes('llama-index')) categories.add('rag');
        
        const actualStack = dependencies.length > 0 
            ? `AI Stack: ${dependencies.join(', ')}` 
            : 'Heuristic (Discovery Mode)';

        const categoryArray = [...categories];

        await reportToSaaS({
            repo_url: repo.html_url,
            repo_name: repo.full_name,
            repo_owner: repo.owner?.login || 'unknown',
            slug: slug,
            stars: repo.stargazers_count,
            language: repo.language || 'unknown',
            detected_ai_stack: actualStack,
            audit_score: score,
            rules_failed: violations,
            rules_passed: passedRules,
            detected_artifacts: finalEvidence.files,
            detected_signals: finalEvidence.detectedSignals,
            missing_signals: finalEvidence.missingSignals,
            score_breakdown: breakdown,
            risk_level: risk_level,
            compliance_status: score > 80 ? 'compliant' : 'pending_review',
            confidence_level: 'Medium',
            summary_text: summary_text,
            visible_gaps: finalEvidence.missingSignals.slice(0, 3),
            is_public: true,
            execution_context: 'discovery',
            categories: JSON.stringify(categoryArray)
        });

        console.log(`[Discovery] Audit recorded for ${repo.name} (Score: ${auditScore})`);
    } catch (err) {
        console.error(`[Discovery] Failed to process ${repo.name}: ${err.message}`);
    } finally {
        if (fs.existsSync(repoPath)) {
            fs.rmSync(repoPath, { recursive: true, force: true });
        }
    }
}

// Helper for reporting
async function reportToSaaS(payload) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(payload);

        const options = {
            hostname: 'gettingsentinel.com',
            path: '/api/discovery',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Sentinel-Discovery-Bot/1.0',
                'X-Sentinel-API-Key': SENTINEL_API_KEY,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => { responseData += chunk; });
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                } else {
                    reject(new Error(`SaaS API error: ${res.statusCode} ${responseData}`));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

const DISK_QUOTA_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

async function main() {
    if (!SENTINEL_API_KEY) {
        console.error('Error: SENTINEL_API_KEY is required for discovery engine.');
        process.exit(1);
    }

    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR);
    }

    const queries = [
        'llm OR rag OR openai OR anthropic OR "ai agent" stars:>10 fork:false',
        'langchain OR "llama-index" OR "vector db" OR pinecone stars:>5 fork:false',
        'transformers OR huggingface OR "ml pipeline" stars:>20 fork:false'
    ];
    const query = queries[Math.floor(Math.random() * queries.length)];

    try {
        await reportToSaaS({
            type: 'run_start',
            run_id: RUN_ID,
            query: query
        });

        const repos = await searchRepositories(query);
        console.log(`[Discovery] Found ${repos.length} candidates. Daily limit: ${DAILY_LIMIT}.`);

        await reportToSaaS({
            type: 'run_update',
            run_id: RUN_ID,
            candidates_found: repos.length
        });

        let processed = 0;
        let recorded = 0;
        let errors = 0;

        for (const repo of repos) {
            if (processed >= DAILY_LIMIT) {
                break;
            }

            const currentDiskUsage = getDirSize(TEMP_DIR);
            if (currentDiskUsage > DISK_QUOTA_BYTES) {
                console.warn(`[Discovery] Disk quota exceeded (${currentDiskUsage} bytes). Cleaning up...`);
                fs.rmSync(TEMP_DIR, { recursive: true, force: true });
                fs.mkdirSync(TEMP_DIR);
            }

            try {
                const result = await processRepository(repo);
                recorded++;
            } catch (e) {
                console.error(`[Discovery] Error processing ${repo.full_name}: ${e.message}`);
                errors++;
            }

            processed++;
            
            // Progress update every 10 repos
            if (processed % 10 === 0) {
                await reportToSaaS({
                    type: 'run_update',
                    run_id: RUN_ID,
                    processed_count: processed,
                    recorded_count: recorded,
                    error_count: errors
                });
            }

            await sleep(2000);
        }

        await reportToSaaS({
            type: 'run_end',
            run_id: RUN_ID,
            status: 'completed',
            processed_count: processed,
            recorded_count: recorded,
            error_count: errors
        });

        console.log('\n[Discovery] Discovery cycle complete.');
    } catch (err) {
        console.error(`[Discovery] Pipeline error: ${err.message}`);
        await reportToSaaS({
            type: 'run_end',
            run_id: RUN_ID,
            status: 'failed',
            error: err.message
        });
    }
}

if (require.main === module) {
    main();
}

module.exports = { detectEvidence, calculateScore };
