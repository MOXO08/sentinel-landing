-- Migration V3: Execution Context Tracking
-- Adds execution_context field to audit_logs

ALTER TABLE audit_logs ADD COLUMN execution_context TEXT CHECK(execution_context IN ('local', 'github_actions', 'gitlab_ci', 'docker', 'unknown')) DEFAULT 'unknown';

-- Backfill existing records
UPDATE audit_logs SET execution_context = 'local' WHERE execution_context IS NULL OR execution_context = 'unknown';
