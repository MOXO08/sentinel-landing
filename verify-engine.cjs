const { detectEvidence, calculateScore } = require('./sentinel-discovery.cjs');
const path = require('path');
const fs = require('fs');

const TEST_REPOS = [
    { 
        name: "FullCompliance", 
        files: ["README.md", "model-card.md", "dataset-card.md", "audit/risk-assessment.md", "GOVERNANCE.md", "PRIVACY.md", "LICENSE", ".github/workflows/ci.yml"],
        content: "Detailed technical file with model card, training data provenance, risk assessment, and governance policy. GDPR compliant data handling."
    },
    { 
        name: "BareRepo", 
        files: ["README.md"],
        content: "A very thin repository with no documentation."
    },
    { 
        name: "MixedEvidence", 
        files: ["README.md", "LICENSE", ".github/workflows/main.yml"],
        content: "Code for an AI agent using Langchain. Has a license and CI, but no specific compliance docs."
    },
    { 
        name: "DocsOnly", 
        files: ["README.md", "docs/architecture.md", "docs/usage.md"],
        content: "Deep documentation regarding architecture and inference pipelines, but missing data/risk/governance."
    },
    { 
        name: "DataFocus", 
        files: ["README.md", "data/provenance.txt"],
        content: "Focuses on dataset curation and training data sources. No model details."
    }
];

const TEMP_TEST = path.join(__dirname, 'verify_temp');

if (fs.existsSync(TEMP_TEST)) fs.rmSync(TEMP_TEST, { recursive: true, force: true });
fs.mkdirSync(TEMP_TEST);

console.log("=== Sentinel Evidence Engine Verification ===\n");

TEST_REPOS.forEach(repo => {
    const repoPath = path.join(TEMP_TEST, repo.name);
    fs.mkdirSync(repoPath);
    repo.files.forEach(file => {
        const filePath = path.join(repoPath, file);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, repo.content || "Placeholder content");
    });

    console.log(`Testing Repo: ${repo.name}`);
    const evidence = detectEvidence(repoPath);
    const { score, breakdown } = calculateScore(evidence);

    console.log(`- Score: ${score}`);
    console.log(`- Detected: ${evidence.detectedSignals.join(', ') || 'None'}`);
    console.log(`- Missing: ${evidence.missingSignals.join(', ') || 'None'}`);
    console.log(`- Rules Passed: ${evidence.passedRules.join(', ')}`);
    console.log(`- Rules Failed: ${evidence.failedRules.join(', ')}`);
    console.log("- Score Breakdown Summary:");
    if (breakdown.penalties.length > 0) console.log("  Penalties: ", breakdown.penalties.map(p => `${p.code}(${p.points})`).join(', '));
    if (breakdown.bonuses.length > 0) console.log("  Bonuses: ", breakdown.bonuses.map(b => `${b.code}(${b.points})`).join(', '));
    console.log("-------------------------------------------\n");
});

fs.rmSync(TEMP_TEST, { recursive: true, force: true });
