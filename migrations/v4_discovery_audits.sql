-- Migration: v4_discovery_audits.sql
-- Description: Create discovery_audits table for autonomous AI repository analysis

CREATE TABLE IF NOT EXISTS discovery_audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_url TEXT NOT NULL,
    repo_name TEXT NOT NULL,
    stars INTEGER,
    language TEXT,
    detected_ai_stack TEXT,
    audit_score INTEGER,
    rules_failed TEXT,
    risk_level TEXT,
    scan_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    execution_context TEXT DEFAULT 'discovery'
);

-- Index for performance on dashboard queries
CREATE INDEX IF NOT EXISTS idx_discovery_risk ON discovery_audits(risk_level);
CREATE INDEX IF NOT EXISTS idx_discovery_stars ON discovery_audits(stars);
CREATE INDEX IF NOT EXISTS idx_discovery_date ON discovery_audits(scan_timestamp);
