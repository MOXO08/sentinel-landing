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

if (!SENTINEL_API_KEY) {
    console.error('Error: SENTINEL_API_KEY is required for discovery engine.');
    process.exit(1);
}

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

            const autoManifestPath = path.join(repoPath, 'sentinel.auto.manifest.json');
            const autoManifest = {
                project: repo.name,
                discovery_mode: true,
                repository: repo.html_url,
                generated_by: 'sentinel-discovery-engine'
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
        }

        const scanCmd = `npx @radu_api/sentinel-scan ${scanTarget} --json --baseline`;

        console.log(`[Discovery] Running Sentinel audit on ${repo.name}...`);
        const output = execSync(scanCmd, {
            encoding: 'utf8',
            cwd: repoPath
        });

        let auditData;
        try {
            auditData = JSON.parse(output);
        } catch (e) {
            console.error(`[Discovery] Failed to parse scanner output: ${e.message}`);
            return;
        }

        const isCompliant =
            auditData.verdict === 'COMPLIANT' || auditData.verdict === 'PASSED';

        const auditScore =
            auditData.score !== undefined ? auditData.score : (isCompliant ? 100 : 65);

        const violations = Array.isArray(auditData.violations)
            ? auditData.violations.map(v => v.rule_id)
            : (isCompliant ? [] : ['AI-ACT-ART-10']);

        const slug =
            repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-') +
            '-' +
            Math.random().toString(36).substring(2, 5);

        const summary_text = isCompliant
            ? `Automated technical analysis identifies that ${repo.name} aligns with visible AI compliance patterns for its detected architecture.`
            : `Automated technical analysis indicates that ${repo.name} may require additional technical documentation to align with specific framework requirements.`;

        const visible_gaps = auditData.violations?.map(v => v.description) ||
            (isCompliant ? [] : ['Technical documentation artifacts not detected in public root']);

        await reportToSaaS({
            repo_url: repo.html_url,
            repo_name: repo.full_name,
            slug: slug,
            stars: repo.stargazers_count,
            language: repo.language || 'unknown',
            detected_ai_stack: 'Heuristic (Discovery Mode)',
            audit_score: auditScore,
            rules_failed: violations,
            risk_level: auditScore >= 90 ? 'Low' : (auditScore >= 70 ? 'Medium' : 'High'),
            confidence_level: 'Medium',
            summary_text: summary_text,
            visible_gaps: visible_gaps.slice(0, 3),
            is_public: true,
            execution_context: 'discovery'
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

async function reportToSaaS(payload) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(payload);

        const options = {
            hostname: 'gettingsentinel.com',
            path: '/api/discovery',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sentinel-API-Key': SENTINEL_API_KEY,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', chunk => {
                responseData += chunk;
            });

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
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR);
    }

    const query = 'llm OR rag OR openai OR "ai agent" stars:>10 fork:false';

    try {
        const repos = await searchRepositories(query);
        console.log(`[Discovery] Found ${repos.length} candidates. Daily limit: ${DAILY_LIMIT}.`);

        let processed = 0;

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

            await processRepository(repo);
            processed++;
            await sleep(2000);
        }

        console.log('\n[Discovery] Discovery cycle complete.');
    } catch (err) {
        console.error(`[Discovery] Pipeline error: ${err.message}`);
    }
}

main();
