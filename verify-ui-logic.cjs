const mockReport = {
    repo_name: "test-repo",
    audit_score: 85,
    summary_text: "Automated technical analysis indicates that this repo is fine.",
    detected_signals: JSON.stringify(["CI workflow", "LICENSE"]),
    missing_signals: JSON.stringify(["Model Card / Technical File (Art. 13)"]),
    visible_gaps: "[]",
    rules_failed: "[]"
};

function getConcreteFinding(report) {
    const missing = typeof report.missing_signals === 'string' ? JSON.parse(report.missing_signals) : (report.missing_signals || []);
    const detected = typeof report.detected_signals === 'string' ? JSON.parse(report.detected_signals) : (report.detected_signals || []);
    const summary = report.summary_text || "";

    // 1. First Missing Signal (Highest Priority)
    if (missing.length > 0) {
        return `Missing critical artifact: ${missing[0].split(' (')[0]}`;
    }

    // 2. First Detected Signal (If no missing)
    if (detected.length > 0) {
        return `Technical evidence detected for ${detected[0].split(' (')[0]}`;
    }

    // 3. Persisted Summary (if non-generic)
    if (summary && summary.length > 20 && !summary.includes("Automated technical analysis indicates")) {
        return summary;
    }

    return "Public technical evidence is limited for this repository.";
}

console.log("--- UI Logic Priority Test ---");
console.log("Scenario 1: Both missing and detected exist");
console.log("Expected: Missing prevails");
console.log("Result: ", getConcreteFinding(mockReport));

console.log("\nScenario 2: Only detected exists");
mockReport.missing_signals = "[]";
console.log("Expected: Detected prevails");
console.log("Result: ", getConcreteFinding(mockReport));

console.log("\nScenario 3: Only custom summary exists");
mockReport.detected_signals = "[]";
mockReport.summary_text = "Highly customized technical assessment for this repo.";
console.log("Expected: Summary prevails");
console.log("Result: ", getConcreteFinding(mockReport));

console.log("\nScenario 4: Generic summary and no signals");
mockReport.summary_text = "Automated technical analysis indicates something generic.";
console.log("Expected: Fallback prevails");
console.log("Result: ", getConcreteFinding(mockReport));
