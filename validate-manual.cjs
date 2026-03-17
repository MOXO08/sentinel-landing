const { detectEvidence, calculateScore } = require('./sentinel-discovery.cjs');
const path = require('path');
const fs = require('fs');

const REPO_PATH = path.join(__dirname, 'real_validation', 'langchain_manual');

process.env.SENTINEL_DEBUG = 'true';

if (!fs.existsSync(REPO_PATH)) {
    console.error(`Repository path does not exist: ${REPO_PATH}`);
    process.exit(1);
}

console.log(`=== Validating Real Repo: ${path.basename(REPO_PATH)} ===\n`);

const evidence = detectEvidence(REPO_PATH);
const { score, breakdown } = calculateScore(evidence);

console.log(`\n--- Results for ${path.basename(REPO_PATH)} ---`);
console.log(`Score: ${score}`);
console.log(`Inventory Size: ${evidence.inventory.length} files`);
console.log(`Detected Signals: ${evidence.detectedSignals.join(', ') || 'None'}`);
console.log(`Missing Signals: ${evidence.missingSignals.join(', ') || 'None'}`);
console.log(`Rules Passed: ${evidence.passedRules.join(', ')}`);
console.log(`Rules Failed: ${evidence.failedRules.join(', ')}`);
console.log("\nScore Breakdown:");
console.log(JSON.stringify(breakdown, null, 2));

const results = [{
    name: path.basename(REPO_PATH),
    score: score,
    detected: evidence.detectedSignals,
    missing: evidence.missingSignals,
    rules_passed: evidence.passedRules,
    rules_failed: evidence.failedRules,
    inventory_size: evidence.inventory.length
}];

fs.writeFileSync('validation_results_manual.json', JSON.stringify(results, null, 2));
console.log("\nPartial validation results saved to validation_results_manual.json");
