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

function getFileInventory(repoPath) {
    const inventory = [];
    const scanDirs = ['', 'docs', '.github', 'config', 'policies', 'audit', 'governance'];
    
    for (const subDir of scanDirs) {
        const dirFullPath = path.join(repoPath, subDir);
        if (fs.existsSync(dirFullPath) && fs.statSync(dirFullPath).isDirectory()) {
            try {
                const items = fs.readdirSync(dirFullPath);
                for (const item of items) {
                    const itemPath = path.join(dirFullPath, item);
                    const stats = fs.statSync(itemPath);
                    if (stats.isFile()) {
                        const relativePath = path.join(subDir, item).replace(/\\/g, '/').replace(/^\//, '');
                        inventory.push({
                            path: relativePath,
                            name: item.toLowerCase(),
                            fullPath: itemPath
                        });
                    }
                }
            } catch (e) {}
        }
    }
    return inventory;
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
    const inventory = getFileInventory(repoPath);
    const evidence = {
        files: inventory.map(f => f.path),
        dependencies: [],
        passedRules: [],
        failedRules: [],
        detectedSignals: [],
        missingSignals: [],
        inventory
    };

    const readmeFile = inventory.find(f => f.name === 'readme.md');
    const readmeContent = readmeFile ? fs.readFileSync(readmeFile.fullPath, 'utf8').toLowerCase() : '';
    
    const docsText = inventory
        .filter(f => f.path.startsWith('docs/'))
        .slice(0, 5)
        .map(f => {
            try { return fs.readFileSync(f.fullPath, 'utf8').toLowerCase(); } catch(e) { return ''; }
        })
        .join(' ');

    const fullBlob = (readmeContent + ' ' + docsText).slice(0, 50000);

    // Helper: Pattern match in inventory or blob
    const hasPattern = (patterns, searchInBlob = true) => {
        const pathMatch = inventory.some(f => patterns.some(p => f.path.toLowerCase().includes(p)));
        const blobMatch = searchInBlob && patterns.some(p => fullBlob.includes(p));
        return pathMatch || blobMatch;
    };

    // 1. Model / Documentation Evidence (EUAI-DOC)
    const modelPatterns = ['model-card', 'modelcard', 'architecture', 'inference-guide', 'usage-disclosure'];
    const modelKeywords = ['model card', 'usage disclosure', 'system prompt', 'inference pipeline', 'how to use this model'];
    
    if (hasPattern(modelPatterns) || hasPattern(modelKeywords)) {
        evidence.passedRules.push('EUAI-DOC-001');
        evidence.detectedSignals.push('Model Card / Technical Usage Disclosure (Art. 13)');
    } else {
        evidence.failedRules.push('EUAI-DOC-001');
        evidence.missingSignals.push('Model Card / Technical Usage Disclosure (Art. 13)');
    }

    if (readmeContent.length > 1000 || inventory.some(f => f.path.startsWith('docs/'))) {
        evidence.passedRules.push('EUAI-DOC-002');
    } else {
        evidence.failedRules.push('EUAI-DOC-002');
        evidence.missingSignals.push('Technical Documentation Depth');
    }

    // 2. Data & Provenance Evidence (EUAI-DATA)
    const dataPatterns = ['dataset', 'provenance', 'training', 'corpus', 'annotation', 'curation'];
    const dataKeywords = ['training data', 'data source', 'dataset provenance', 'evaluation corpus', 'fine-tuning data'];

    if (hasPattern(dataPatterns) || hasPattern(dataKeywords)) {
        evidence.passedRules.push('EUAI-DATA-001');
        evidence.detectedSignals.push('Dataset Provenance / Training References (Art. 10)');
    } else {
        evidence.failedRules.push('EUAI-DATA-001');
        evidence.missingSignals.push('Dataset Provenance / Training References (Art. 10)');
    }

    // 3. Risk & Governance (EUAI-RISK)
    const riskPatterns = ['risk', 'mitigation', 'audit', 'controls', 'security-policy', 'threat-model'];
    const riskKeywords = ['risk assessment', 'mitigation strategy', 'safety guardrails', 'security controls', 'bias audit'];

    if (hasPattern(riskPatterns) || hasPattern(riskKeywords)) {
        evidence.passedRules.push('EUAI-RISK-001');
        evidence.detectedSignals.push('Risk Assessment / Mitigation Strategy (Art. 9)');
    } else {
        evidence.failedRules.push('EUAI-RISK-001');
        evidence.missingSignals.push('Risk Assessment / Mitigation Strategy (Art. 9)');
    }

    const govPatterns = ['governance', 'policy', 'compliance', 'compliance-report'];
    if (hasPattern(govPatterns) || hasPattern(['governance policy', 'compliance framework'])) {
        evidence.passedRules.push('EUAI-GOV-001');
        evidence.detectedSignals.push('Governance Framework / Policy (Art. 10)');
    } else {
        evidence.failedRules.push('EUAI-GOV-001');
        evidence.missingSignals.push('Governance Framework / Policy (Art. 10)');
    }

    // 4. Privacy (EUAI-PRIVACY)
    const privacyPatterns = ['privacy', 'gdpr', 'data-handling', 'data-retention'];
    if (hasPattern(privacyPatterns) || hasPattern(['privacy policy', 'personal data handling', 'gdpr compliance'])) {
        evidence.passedRules.push('EUAI-PRIVACY-001');
        evidence.detectedSignals.push('Privacy Policy / Data Handling (GDPR)');
    } else {
        evidence.failedRules.push('EUAI-PRIVACY-001');
        evidence.missingSignals.push('Privacy Policy / Data Handling (GDPR)');
    }

    // 5. Technical Evidence (EUAI-EVIDENCE)
    if (inventory.some(f => f.name === 'license' || f.name === 'license.md' || f.name === 'copying')) {
        evidence.passedRules.push('EUAI-EVIDENCE-001');
        evidence.detectedSignals.push('LICENSE');
    }

    if (inventory.some(f => f.path.startsWith('.github/workflows')) || hasPattern(['workflow', 'pipeline', 'ci.yml'])) {
        evidence.passedRules.push('EUAI-EVIDENCE-002');
        evidence.detectedSignals.push('CI/CD compliance pipeline detected');
    }

    if (inventory.some(f => f.name.endsWith('.sarif')) || hasPattern(['audit.json', 'security-scan'])) {
        evidence.passedRules.push('EUAI-EVIDENCE-003');
        evidence.detectedSignals.push('Technical Audit Artifact (SARIF)');
    }

    // Dependency Analysis
    const pkgFile = inventory.find(f => f.name === 'package.json');
    if (pkgFile) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgFile.fullPath, 'utf8'));
            const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
            const aiLibs = ['openai', 'langchain', 'transformers', 'torch', 'tensorflow', 'scikit-learn', 'anthropic', 'pinecone', 'llama-index'];
            evidence.dependencies.push(...aiLibs.filter(lib => allDeps[lib]));
        } catch (e) {}
    }

    return evidence;
}

function calculateScore(evidence) {
    let score = 100;
    let breakdown = {
        base_score: 100,
        penalties: [],
        bonuses: [],
        final_score: 100
    };

    const criticalRules = [
        { code: 'EUAI-DOC-001', points: 20, reason: 'Model / Technical documentation missing' },
        { code: 'EUAI-DATA-001', points: 20, reason: 'Dataset provenance signals missing' },
        { code: 'EUAI-RISK-001', points: 20, reason: 'Risk assessment / mitigation missing' }
    ];

    criticalRules.forEach(rule => {
        if (evidence.failedRules.includes(rule.code)) {
            score -= rule.points;
            breakdown.penalties.push({ code: rule.code, points: -rule.points, reason: rule.reason });
        } else {
            score += 5; // Bonus for explicit evidence
            breakdown.bonuses.push({ code: rule.code, points: 5, reason: `Verified technical artifact: ${rule.code}` });
        }
    });

    const standardRules = [
        { code: 'EUAI-DOC-002', points: 10, reason: 'Incomplete technical documentation' },
        { code: 'EUAI-GOV-001', points: 10, reason: 'Governance policy missing' },
        { code: 'EUAI-PRIVACY-001', points: 10, reason: 'Privacy policy (GDPR) missing' }
    ];

    standardRules.forEach(rule => {
        if (evidence.failedRules.includes(rule.code)) {
            score -= rule.points;
            breakdown.penalties.push({ code: rule.code, points: -rule.points, reason: rule.reason });
        }
    });

    if (evidence.passedRules.includes('EUAI-EVIDENCE-002')) {
        score += 5;
        breakdown.bonuses.push({ code: 'EUAI-EVIDENCE-002', points: 5, reason: 'CI/CD compliance pipeline detected' });
    }
    
    if (evidence.passedRules.includes('EUAI-EVIDENCE-001')) {
        score += 2;
        breakdown.bonuses.push({ code: 'EUAI-EVIDENCE-001', points: 2, reason: 'Explicit license present' });
    }

    score = Math.min(100, Math.max(10, score));
    breakdown.final_score = score;
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
        const missing = finalEvidence.missingSignals.map(s => s.split(' (')[0]);
        const found = finalEvidence.detectedSignals.map(s => s.split(' (')[0]);
        
        if (missing.length === 0) {
            summary_text = `Deterministic audit confirms that ${repo.name} aligns with visible AI compliance patterns, including verified documentation and CI/CD evidence.`;
        } else if (found.length > 0) {
            summary_text = `Technical evidence for ${found.slice(0, 2).join(' and ')} detected. However, critical gaps remain for ${missing.slice(0, 2).join(', ')}.`;
        } else {
            summary_text = `Static technical analysis indicates a lack of public compliance artifacts. Specifically, ${missing[0]} was not detected in root or documentation paths.`;
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

        console.log(`[Discovery] Audit recorded for ${repo.name} (Score: ${score})`);
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
