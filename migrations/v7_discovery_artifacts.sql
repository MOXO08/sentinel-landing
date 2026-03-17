-- Migration: v7_discovery_artifacts.sql
-- Description: Add columns for explicit evidence tracking (passed rules and detected artifacts)

ALTER TABLE discovery_audits ADD COLUMN rules_passed TEXT;
ALTER TABLE discovery_audits ADD COLUMN detected_artifacts TEXT;
