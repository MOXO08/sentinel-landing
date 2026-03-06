-- Migration: Add webhook_url to clients table
ALTER TABLE clients ADD COLUMN webhook_url TEXT;

-- Index for faster lookup of enterprise clients if needed
CREATE INDEX idx_clients_plan ON clients(plan);
