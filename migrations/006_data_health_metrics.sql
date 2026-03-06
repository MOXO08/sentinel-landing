-- Migration: Add Article 10 Data Health Metrics
ALTER TABLE Audit_Reports ADD COLUMN Data_Health_Score INTEGER DEFAULT 100;
ALTER TABLE Audit_Reports ADD COLUMN Distribution_Payload TEXT;
