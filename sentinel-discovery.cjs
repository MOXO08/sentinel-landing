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
        flags: []
    };

    const complianceFiles = {
        'LICENSE': 'audit_license_present',
        'PRIVACY.md': 'transparency_policy_documented',
        'SECURITY.md': 'security_policy_documented',
        'GOVERNANCE.md': ['human_oversight_documented', 'data_governance_policy_documented'],
        'CONTRIBUTING.md': 'developer_guidelines_present',
        'model-card.md': 'model_card_present',
        'dataset-card.md': 'dataset_card_present',
        'POLICY.md': 'data_governance_policy_documented',
        'CONFORMITY.md': 'conformity_assessment_completed',
        'AUDIT.md': 'conformity_assessment_completed',
        'Dockerfile': 'deployment_containerized'
    };

    for (const [file, flags] of Object.entries(complianceFiles)) {
        if (fs.existsSync(path.join(repoPath, file))) {
            evidence.files.push(file);
            const flagList = Array.isArray(flags) ? flags : [flags];
            evidence.flags.push(...flagList);
        }
    }

    // Dependency Analysis
    const pkgPath = path.join(repoPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
            const aiLibs = [
                'openai', 'langchain', 'transformers', 'torch', 'tensorflow', 'scikit-learn', 
                'anthropic', 'pinecone', 'llama-index', 'chromadb', 'milvus', 'weaviate',
                'langgraph', 'crewai', 'autogpt', 'babyagi', 'bentoml', 'fastapi', 'streamlit'
            ];
            evidence.dependencies.push(...aiLibs.filter(lib => allDeps[lib]));
        } catch (e) {}
    }

    const pythonConfigs = ['requirements.txt', 'pyproject.toml', 'setup.py', 'Pipfile'];
    for (const pyFile of pythonConfigs) {
        const fullPath = path.join(repoPath, pyFile);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
            const aiLibs = [
                'openai', 'langchain', 'transformers', 'torch', 'tensorflow', 'scikit-learn', 
                'anthropic', 'pinecone', 'llama-index', 'chromadb', 'milvus', 'weaviate',
                'langgraph', 'crewai', 'autogpt', 'babyagi', 'bentoml', 'fastapi', 'streamlit'
            ];
            const found = aiLibs.filter(lib => content.includes(lib));
            evidence.dependencies.push(...found);
        }
    }
    evidence.dependencies = [...new Set(evidence.dependencies)];

    // CI and Artifact Analysis
    const ciPaths = [
        '.github/workflows',
        '.gitlab-ci.yml',
        'sentinel-results',
        'audit-results'
    ];
    for (const ciPath of ciPaths) {
        if (fs.existsSync(path.join(repoPath, ciPath))) {
            evidence.flags.push('ci_integration_detected');
            evidence.files.push(ciPath);
        }
    }

    const sarifFiles = fs.readdirSync(repoPath).filter(f => f.endsWith('.sarif'));
    if (sarifFiles.length > 0) {
        evidence.flags.push('static_analysis_artifacts_present');
        evidence.files.push(sarifFiles[0]);
    }

    // Keyword Analysis (README)
    const readmePath = path.join(repoPath, 'README.md');
    if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf8').toLowerCase();
        const keywords = {
            'transparency': 'transparency_measures_declared',
            'bias': 'bias_assessment_performed',
            'fairness': 'bias_assessment_performed',
            'human oversight': 'human_oversight_enabled',
            'notification': 'user_notification_ai_interaction',
            'transparent': 'user_notification_ai_interaction',
            'safety': 'safety_protocols_mentioned',
            'governance': 'data_governance_policy_documented',
            'conformity': 'conformity_assessment_completed'
        };
        for (const [word, flag] of Object.entries(keywords)) {
            if (content.includes(word)) {
                evidence.keywords.push(word);
                evidence.flags.push(flag);
            }
        }
    }

    evidence.flags = [...new Set(evidence.flags)];
    return evidence;
}

function calculateScore(auditData, repo) {
    const isCompliant =
        auditData.verdict === 'COMPLIANT' || auditData.verdict === 'PASSED';

    // Hybrid scoring heuristic: Scanner Results + Raw Evidence Signals
    let baseScore = isCompliant ? 100 : 90;
    
    // 1. Penalize based on scanner findings
    if (auditData.summary) {
        baseScore -= (auditData.summary.high || 0) * 15;
        baseScore -= (auditData.summary.medium || 0) * 8;
        baseScore -= (auditData.summary.low || 0) * 4;
    }

    // 2. Bonus for detected artifacts (differentiator)
    const evidence = repo._discoveryEvidence || { flags: [], dependencies: [] };
    const uniqueSignals = new Set(evidence.flags);
    
    // Critical compliance signals (5 points each)
    const criticalFlags = [
        'audit_license_present',
        'transparency_policy_documented',
        'security_policy_documented',
        'human_oversight_enabled',
        'bias_assessment_performed',
        'conformity_assessment_completed',
        'model_card_present'
    ];
    
    criticalFlags.forEach(flag => {
        if (uniqueSignals.has(flag)) baseScore += 5;
        else if (!isCompliant) baseScore -= 3; // Penalty for missing expected discovery signals
    });

    // 3. Modifiers for stack and integration
    if (evidence.dependencies.length > 0) baseScore += 2; // Real AI stack detected
    if (uniqueSignals.has('ci_integration_detected')) baseScore += 3;
    if (uniqueSignals.has('static_analysis_artifacts_present')) baseScore += 3;

    return Math.min(100, Math.max(10, baseScore));
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

        const isCompliant =
            auditData.verdict === 'COMPLIANT' || auditData.verdict === 'PASSED';

        const auditScore = calculateScore(auditData, repo);

        const violations = Array.isArray(auditData.violations)
            ? auditData.violations.map(v => v.rule_id)
            : (isCompliant ? [] : ['AI-ACT-ART-10']);

        // Align risk level with compliance_status and score
        let risk_level = 'Low';
        if (auditData.compliance_status === 'high_risk' || auditData.compliance_status === 'blocked' || auditScore < 60) {
            risk_level = 'High';
        } else if (auditScore < 85) {
            risk_level = 'Medium';
        }

        const slug =
            repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-') +
            '-' +
            Math.random().toString(36).substring(2, 5);

        const summary_text = isCompliant
            ? `Automated technical analysis identifies that ${repo.name} aligns with visible AI compliance patterns for its detected architecture.`
            : `Automated technical analysis indicates that ${repo.name} may require additional technical documentation to align with specific framework requirements.`;

        const visible_gaps = auditData.violations?.map(v => v.description) ||
            (isCompliant ? [] : ['Technical documentation artifacts not detected in public root']);

        // Refine AI Stack and Gaps from evidence if available
        const dependencies = repo._discoveryEvidence?.dependencies || [];
        
        // Categorization logic
        const categories = new Set();
        if (dependencies.includes('openai') || dependencies.includes('anthropic')) categories.add('openai');
        if (dependencies.includes('langchain') || dependencies.includes('langgraph') || dependencies.includes('crewai')) categories.add('langchain');
        if (dependencies.includes('llama-index') || dependencies.includes('pinecone') || dependencies.includes('chromadb') || dependencies.includes('milvus')) categories.add('rag');
        if (dependencies.includes('autogpt') || dependencies.includes('babyagi') || dependencies.includes('crewai')) categories.add('agents');
        if (dependencies.includes('transformers') || dependencies.includes('torch') || dependencies.includes('tensorflow')) categories.add('transformers');
        
        const actualStack = dependencies.length > 0 
            ? `AI Stack: ${dependencies.join(', ')}` 
            : 'Heuristic (Discovery Mode)';

        const categoryArray = Array.isArray(auditData.categories) ? auditData.categories : [...categories];

        await reportToSaaS({
            repo_url: repo.html_url,
            repo_name: repo.full_name,
            repo_owner: repo.owner?.login || 'unknown',
            slug: slug,
            stars: repo.stargazers_count,
            language: repo.language || 'unknown',
            detected_ai_stack: actualStack,
            audit_score: auditScore,
            rules_failed: violations,
            risk_level: risk_level,
            compliance_status: auditData.compliance_status || 'unknown',
            confidence_level: 'Medium',
            summary_text: summary_text,
            visible_gaps: visible_gaps.slice(0, 3),
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
