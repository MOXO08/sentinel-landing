-- Simulation script to add a mock Art 10 audit
INSERT INTO Audit_Reports (Repo_ID, Commit_Hash, Scor_Compliance, JSON_Payload, Signature, Data_Health_Score, Distribution_Payload, Created_At)
VALUES (
    'https://github.com/enterprise/ai-platform',
    'sha256-test-commit-001',
    15,
    '{"verdict":"HUMAN_INTERVENTION_REQUIRED","risk_score":15,"violations":[{"article":"Art 10","description":"Slight bias detected in demographic A","severity":"MEDIUM"}]}',
    'SIMULATED_ENTERPRISE_SIG',
    82,
    '{"age": 0.45, "gender": 0.51, "geography": 0.12, "income": 0.78, "education": 0.33}',
    datetime('now')
);
