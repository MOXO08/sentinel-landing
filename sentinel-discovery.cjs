const https = require('https');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SENTINEL_API_KEY = process.env.SENTINEL_API_KEY;
const DAILY_LIMIT = 100;
const BATCH_SIZE = 20;

const RUN_ID = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const DEBUG = process.env.SENTINEL_DEBUG === 'true';

// --- API Helpers ---
async function githubApiRequest(apiPath, options = {}) {
    const url = `https://api.github.com${apiPath}`;
    const token = GITHUB_TOKEN || process.env.GITHUB_TOKEN;

    return new Promise((resolve, reject) => {
        const headers = {
            'User-Agent': 'Sentinel-Discovery-Engine',
            'Accept': options.accept || 'application/vnd.github.v3+json'
        };
        if (token) headers['Authorization'] = `token ${token}`;

        const reqOptions = { headers };

        https.get(url, reqOptions, (res) => {
            const remaining = parseInt(res.headers['x-ratelimit-remaining'] || '100', 10);
            const resetTime = parseInt(res.headers['x-ratelimit-reset'] || '0', 10) * 1000;

            if (res.statusCode === 403 && remaining === 0) {
                const waitTime = Math.max(0, resetTime - Date.now()) + 1000;
                console.warn(`[Discovery] Rate limit hit. Cooling down for ${Math.ceil(waitTime / 60000)} mins...`);
                return resolve({ rateLimited: true, waitTime });
            }

            if (res.statusCode === 404) {
                return resolve({ notFound: true });
            }

            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`GitHub API error: ${res.statusCode} (Path: ${apiPath})`));
                }

                if (options.json === false) {
                    return resolve({ data });
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

async function fetchRepoTree(owner, repo, branch = 'main') {
    if (DEBUG) console.log(`[Debug] Fetching tree for ${owner}/${repo} (${branch})...`);
    let res = await githubApiRequest(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    
    if (res.notFound && branch === 'main') {
        if (DEBUG) console.log(`[Debug] 'main' not found, falling back to 'master'...`);
        res = await githubApiRequest(`/repos/${owner}/${repo}/git/trees/master?recursive=1`);
    }

    if (res.rateLimited) {
        await sleep(res.waitTime);
        return fetchRepoTree(owner, repo, branch);
    }

    if (!res.data || !res.data.tree) {
        if (DEBUG) console.warn(`[Debug] Could not fetch tree for ${repo}. Status: ${res.notFound ? 'Not Found' : 'Error'}`);
        return [];
    }

    return res.data.tree
        .filter(item => item.type === 'blob')
        .map(item => ({
            path: item.path,
            name: path.basename(item.path).toLowerCase(),
            size: item.size,
            sha: item.sha
        }));
}

async function fetchRepoReadme(owner, repo) {
    if (DEBUG) console.log(`[Debug] Fetching README for ${owner}/${repo}...`);
    const res = await githubApiRequest(`/repos/${owner}/${repo}/readme`);
    
    if (res.rateLimited) {
        await sleep(res.waitTime);
        return fetchRepoReadme(owner, repo);
    }

    if (res.notFound || !res.data || !res.data.content) {
        return '';
    }

    return Buffer.from(res.data.content, 'base64').toString('utf8');
}

async function fetchFileContent(owner, repo, filePath) {
    if (DEBUG) console.log(`[Debug] Fetching file content: ${filePath}...`);
    const res = await githubApiRequest(`/repos/${owner}/${repo}/contents/${filePath}`);

    if (res.rateLimited) {
        await sleep(res.waitTime);
        return fetchFileContent(owner, repo, filePath);
    }

    if (res.notFound || !res.data || !res.data.content) {
        return '';
    }

    return Buffer.from(res.data.content, 'base64').toString('utf8');
}

function detectEvidence(inventory, readmeContent, docsText) {
    const evidence = {
        files: inventory.map(f => f.path),
        dependencies: [],
        passedRules: [],
        failedRules: [],
        detectedSignals: [],
        missingSignals: [],
        inventory
    };

    const fullBlob = (readmeContent.toLowerCase() + ' ' + docsText.toLowerCase()).slice(0, 150000);

    // Helper: Pattern match in inventory or blob
    const hasPattern = (patterns, searchInBlob = true) => {
        const pathMatch = inventory.some(f => patterns.some(p => f.path.toLowerCase().includes(p)));
        const blobMatch = searchInBlob && patterns.some(p => fullBlob.includes(p.toLowerCase()));
        
        if (DEBUG && (pathMatch || blobMatch)) {
            console.log(`[Debug] Pattern Match Found: [${patterns.join('|')}] (Path: ${pathMatch}, Blob: ${blobMatch})`);
        }
        
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

    // Dependency Analysis (Placeholder - requires additional API call per repo if needed)
    // For now, we rely on the inventory paths and README/Docs content patterns.
    const aiLibs = ['openai', 'langchain', 'transformers', 'torch', 'tensorflow', 'scikit-learn', 'anthropic', 'pinecone', 'llama-index'];
    aiLibs.forEach(lib => {
        if (fullBlob.includes(lib)) evidence.dependencies.push(lib);
    });

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
    const owner = repo.owner.login;
    const repoName = repo.name;
    console.log(`\n[Discovery] Processing: ${repo.full_name} (${repo.stargazers_count} stars)`);

    try {
        // 1. Fetch Inventory via Tree API (Recursive)
        const inventory = await fetchRepoTree(owner, repoName);
        if (inventory.length === 0) {
            console.warn(`[Discovery] Skipping ${repo.full_name}: Empty or inaccessible tree.`);
            return;
        }

        // 2. Fetch README Content
        const readmeContent = await fetchRepoReadme(owner, repoName);

        // 3. Fetch Documentation Snippets
        const docFiles = inventory
            .filter(f => f.path.toLowerCase().includes('doc/') || f.path.toLowerCase().includes('docs/'))
            .filter(f => ['.md', '.rst', '.txt'].some(ext => f.name.endsWith(ext)))
            .slice(0, 5);
        
        let docsText = '';
        for (const docFile of docFiles) {
            const content = await fetchFileContent(owner, repoName, docFile.path);
            docsText += content + '\n';
        }

        // 4. Run Evidence Detection
        const finalEvidence = detectEvidence(inventory, readmeContent, docsText);

        // 5. Scoring
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

async function main() {
    if (!SENTINEL_API_KEY) {
        console.error('Error: SENTINEL_API_KEY is required for discovery engine.');
        process.exit(1);
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
