const { detectEvidence, calculateScore } = require('./sentinel-discovery.cjs');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function githubApiRequest(apiPath, options = {}) {
    const url = `https://api.github.com${apiPath}`;
    return new Promise((resolve, reject) => {
        const headers = {
            'User-Agent': 'Sentinel-Discovery-Engine',
            'Accept': options.accept || 'application/vnd.github.v3+json'
        };
        if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        
        const reqOptions = { headers };
        https.get(url, reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode !== 200) return reject(new Error(`API error: ${res.statusCode}`));
                resolve({ data: JSON.parse(data) });
            });
        }).on('error', reject);
    });
}

// Re-implementing the fetchers locally for the test script because they aren't exported
async function fetchRepoTree(owner, repo, branch = 'main') {
    try {
        const res = await githubApiRequest(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
        return res.data.tree.filter(i => i.type === 'blob').map(i => ({ path: i.path, name: i.path.toLowerCase() }));
    } catch (e) {
        if (branch === 'main') return fetchRepoTree(owner, repo, 'master');
        throw e;
    }
}

async function fetchRepoReadme(owner, repo) {
    const res = await githubApiRequest(`/repos/${owner}/${repo}/readme`);
    return Buffer.from(res.data.content, 'base64').toString('utf8');
}

const TEST_REPOS = [
    { owner: "huggingface", repo: "transformers" },
    { owner: "langchain-ai", repo: "langchain" }
];

process.env.SENTINEL_DEBUG = 'true';

async function test() {
    for (const repo of TEST_REPOS) {
        console.log(`\n=== Testing API Discovery: ${repo.owner}/${repo.repo} ===`);
        const inventory = await fetchRepoTree(repo.owner, repo.repo);
        console.log(`Inventory: ${inventory.length} files`);
        
        const readme = await fetchRepoReadme(repo.owner, repo.repo);
        console.log(`README size: ${readme.length} chars`);
        
        const evidence = detectEvidence(inventory, readme, "");
        const { score, breakdown } = calculateScore(evidence);
        
        console.log(`Score: ${score}`);
        console.log(`Detected: ${evidence.detectedSignals.join(', ')}`);
        console.log(`Missing: ${evidence.missingSignals.join(', ')}`);
    }
}

test().catch(console.error);
