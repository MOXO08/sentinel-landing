-- Migration: v6_discovery_extended.sql
-- Description: Add missing columns to discovery_audits and create discovery_runs table

-- 1. Extend discovery_audits
ALTER TABLE discovery_audits ADD COLUMN repo_owner TEXT;
ALTER TABLE discovery_audits ADD COLUMN compliance_status TEXT;
ALTER TABLE discovery_audits ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- 2. Create unique index for repo_url to support UPSERT
CREATE UNIQUE INDEX IF NOT EXISTS idx_discovery_repo_url ON discovery_audits(repo_url);

-- 3. Create discovery_runs table
CREATE TABLE IF NOT EXISTS discovery_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id TEXT UNIQUE NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME,
    status TEXT DEFAULT 'running', -- running, completed, failed
    candidates_found INTEGER DEFAULT 0,
    processed_count INTEGER DEFAULT 0,
    recorded_count INTEGER DEFAULT 0,
    skipped_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0
);

-- 4. Create discovery_run_items table (for granular history)
CREATE TABLE IF NOT EXISTS discovery_run_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id TEXT NOT NULL,
    repo_name TEXT NOT NULL,
    status TEXT, -- success, skipped, error
    score INTEGER,
    reason TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (run_id) REFERENCES discovery_runs(run_id)
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_discovery_owner ON discovery_audits(repo_owner);
CREATE INDEX IF NOT EXISTS idx_discovery_status ON discovery_audits(compliance_status);
CREATE INDEX IF NOT EXISTS idx_run_status ON discovery_runs(status);
CREATE INDEX IF NOT EXISTS idx_run_item_run_id ON discovery_run_items(run_id);
