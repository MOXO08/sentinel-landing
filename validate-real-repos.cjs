const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { detectEvidence, calculateScore } = require('./sentinel-discovery.cjs');

const REAL_REPOS = [
    { name: "transformers", url: "https://github.com/huggingface/transformers" },
    { name: "langchain", url: "https://github.com/langchain-ai/langchain" },
    { name: "openai-python", url: "https://github.com/openai/openai-python" }
];

const VALIDATION_DIR = path.join(__dirname, 'real_validation');
if (fs.existsSync(VALIDATION_DIR)) {
    try {
        fs.rmSync(VALIDATION_DIR, { recursive: true, force: true });
    } catch(e) {
        console.log("Cleanup failed, using unique dir");
    }
}
const SESSION_DIR = path.join(VALIDATION_DIR, Date.now().toString());
fs.mkdirSync(SESSION_DIR, { recursive: true });

process.env.SENTINEL_DEBUG = 'true';

async function validate() {
    console.log("=== Real-World Evidence Engine Validation ===\n");
    const results = [];

    for (const repo of REAL_REPOS) {
        console.log(`\nValidating: ${repo.name} (${repo.url})`);
        const repoPath = path.join(SESSION_DIR, repo.name);
        
        try {
            console.log(`[Validation] Cloning ${repo.name}...`);
            execSync(`git clone ${repo.url} ${repoPath}`, { stdio: 'inherit' });
            
            const evidence = detectEvidence(repoPath);
            const { score, breakdown } = calculateScore(evidence);
            
            const res = {
                name: repo.name,
                url: repo.url,
                score,
                detected: evidence.detectedSignals,
                missing: evidence.missingSignals,
                rules_passed: evidence.passedRules,
                rules_failed: evidence.failedRules,
                inventory_size: evidence.inventory.length
            };
            results.push(res);
            
            console.log(`[Validation] Success: ${repo.name}`);
            console.log(` - Score: ${score}`);
            console.log(` - Inventory: ${res.inventory_size} files`);
            console.log(` - Detected: ${res.detected.length} signals`);
            console.log(` - Missing: ${res.missing.length} signals`);
            
        } catch (e) {
            console.error(`[Validation] Failed to validate ${repo.name}: ${e.message}`);
        } finally {
            // Optional: keep for manual inspection if needed, but normally cleanup
            // if (fs.existsSync(repoPath)) fs.rmSync(repoPath, { recursive: true, force: true });
        }
    }

    console.log("\n\n=== Final Validation Matrix ===\n");
    console.table(results.map(r => ({
        Repo: r.name,
        Score: r.score,
        Inventory: r.inventory_size,
        "Detected Signals": r.detected.length,
        "Missing Signals": r.missing.length
    })));

    fs.writeFileSync('validation_results.json', JSON.stringify(results, null, 2));
    console.log("\nFull results saved to validation_results.json");
}

validate().catch(console.error);
