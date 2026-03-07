-- Simulation script to add a teased audit
INSERT INTO Audit_Reports (Repo_ID, Commit_Hash, Scor_Compliance, JSON_Payload, Signature, Created_At)
VALUES (
    'enterprise/demo',
    'demo-enterprise-audit',
    42,
    '{"verdict":"NON_COMPLIANT","risk_score":42,"violations":[{"article":"Art 5","description":"Prohibited cognitive manipulation detected","severity":"CRITICAL","fix_snippet":"Remove subconscious triggers."},{"article":"Art 13","description":"Transparency metadata missing","severity":"MEDIUM","fix_snippet":"Include Model Card."},{"article":"LOCKED","description":"[PRO/ENT ONLY] 14 additional high-risk violations detected. Access restricted under Free Tier.","severity":"CRITICAL","fix_snippet":"Visit gettingsentinel.com to unlock the Full Regulatory Audit and Technical File."}],"teasing_mode":true}',
    'TEASE_SIG_DEMO',
    datetime('now')
);
