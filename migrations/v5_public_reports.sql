-- Migration: v5_public_reports.sql
-- Description: Extend discovery_audits with fields for public SEO reports

ALTER TABLE discovery_audits ADD COLUMN slug TEXT;
ALTER TABLE discovery_audits ADD COLUMN confidence_level TEXT DEFAULT 'Medium';
ALTER TABLE discovery_audits ADD COLUMN summary_text TEXT;
ALTER TABLE discovery_audits ADD COLUMN visible_gaps TEXT;
ALTER TABLE discovery_audits ADD COLUMN is_public BOOLEAN DEFAULT 0;

-- Create index for slug-based lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_discovery_slug ON discovery_audits(slug);
