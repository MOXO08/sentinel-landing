-- Migration V2: Privacy-Safe Telemetry
-- Adds anonymous tracking fields to audit_logs table

ALTER TABLE audit_logs ADD COLUMN anonymous_client_id TEXT;
ALTER TABLE audit_logs ADD COLUMN scan_id TEXT;
ALTER TABLE audit_logs ADD COLUMN project_hash TEXT;
ALTER TABLE audit_logs ADD COLUMN cli_version TEXT;

-- Indexing for performance on aggregate queries
CREATE INDEX idx_audit_anon_client ON audit_logs(anonymous_client_id);
CREATE INDEX idx_audit_project_hash ON audit_logs(project_hash);
