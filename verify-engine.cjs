const { detectEvidence, calculateScore } = require('./sentinel-discovery.cjs');
const path = require('path');

async function test() {
    console.log("--- Testing Evidence Engine Logic ---\n");
    const repoPath = path.resolve('.');
    console.log(`Checking path: ${repoPath}`);

    try {
        const evidence = detectEvidence(repoPath);
        console.log("\n[Evidence Detected]:");
        console.log(JSON.stringify(evidence, null, 2));

        const scoreObj = calculateScore(evidence);
        console.log("\n[Score Calculation]:");
        console.log(JSON.stringify(scoreObj, null, 2));

        console.log("\n--- Verification Complete ---");
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
