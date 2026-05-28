-- =============================================================================
-- SQL MIGRATION SCHEMA: "Advantage Teams" High-Scalability Support Backend
-- Author: Expert Full-Stack Database Engineer
-- Database Engine: PostgreSQL 14+ / Supabase
-- Description:
--   Optimized relational schema to scale support teams up to 12 tech resources,
--   ingesting offline timelines, discrete update channels, and historical outbound
--   feedback surveys with bulletproof indexing and constraints.
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PART 1: DROP TABLES (FOR CLEAN CASCADE SETUP)
-- =============================================================================
DROP TABLE IF EXISTS survey_history CASCADE;
DROP TABLE IF EXISTS system_updates CASCADE;
DROP TABLE IF EXISTS activity_timelines CASCADE;
DROP TABLE IF EXISTS agent_profiles CASCADE;

-- =============================================================================
-- PART 2: THE SCHEMA TABLES DEFINITIONS
-- =============================================================================

-- 1. Table: agent_profiles
-- Represents support technicians. Extension numbers are treated as natural unique keys.
CREATE TABLE agent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    3cx_extension VARCHAR(20) NOT NULL UNIQUE,
    representative_name VARCHAR(150) NOT NULL CONSTRAINT chk_name_not_empty CHECK (char_length(trim(representative_name)) >= 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Table: activity_timelines
-- Contains intervals during which engineers perform specialized offline or call-handling activities.
CREATE TABLE activity_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agent_profiles(id) ON DELETE CASCADE,
    status_label VARCHAR(100) NOT NULL CONSTRAINT chk_status_label_not_empty CHECK (char_length(trim(status_label)) >= 2),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_seconds INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN end_time IS NULL THEN NULL 
            ELSE EXTRACT(EPOCH FROM (end_time - start_time))::INTEGER 
        END
    ) STORED,
    CONSTRAINT chk_timeline_timestamps CHECK (end_time IS NULL OR end_time >= start_time)
);

-- 3. Table: system_updates
-- Tracks discrete CRM or ticket edits done by agents to correlate focus and output densities.
CREATE TABLE system_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agent_profiles(id) ON DELETE CASCADE,
    update_type VARCHAR(100) NOT NULL,
    log_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: survey_history
-- Chronic records of post-call customer satisfaction survey dispatches and suppression alerts.
CREATE TABLE survey_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_phone VARCHAR(50) NOT NULL,
    call_duration_seconds INTEGER NOT NULL CONSTRAINT chk_call_duration CHECK (call_duration_seconds >= 0),
    agent_extension VARCHAR(20) NOT NULL REFERENCES agent_profiles(3cx_extension) ON DELETE CASCADE,
    delivery_status VARCHAR(50) NOT NULL CONSTRAINT chk_delivery_status CHECK (delivery_status IN ('Sent', 'Skipped: Under 2 Minutes', 'Skipped: Daily Cap Hit')),
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- PART 3: HIGH-PERFORMANCE INDEXING STRATEGY
-- =============================================================================
CREATE INDEX idx_activity_timelines_agent_span ON activity_timelines (agent_id, start_time, end_time DESC);
CREATE INDEX idx_system_updates_tracker ON system_updates (agent_id, log_timestamp DESC);
CREATE INDEX idx_survey_history_lookup ON survey_history (customer_phone, processed_at DESC);
CREATE INDEX idx_agent_profiles_extension ON agent_profiles (3cx_extension);

-- =============================================================================
-- PART 4: THE MASTER SCALED SEED MATRIX
-- =============================================================================

-- Seed 12 support technicians (UUIDs pre-generated for deterministic relationships)
INSERT INTO agent_profiles (id, 3cx_extension, representative_name, is_active) VALUES
('b1111111-1111-1111-1111-111111111111', '101', 'Sarah Jenkins', true),
('b2222222-2222-2222-2222-222222222222', '102', 'Marcus Vance', true),
('b3333333-3333-3333-3333-333333333333', '103', 'Elena Rostova', true),
('b4444444-4444-4444-4444-444444444444', '104', 'David Kim', true),
('b5555555-5555-5555-5555-555555555555', '105', 'Amanda Ross', true),
('b6666666-6666-6666-6666-666666666666', '106', 'Carlos Mendez', true),
('b7777777-7777-7777-7777-777777777777', '107', 'Rachel Green', true),
('b8888888-8888-8888-8888-888888888888', '108', 'James Wilson', true),
('b9999999-9999-9999-9999-999999999999', '109', 'Priya Patel', true),
('c1111111-1111-1111-1111-111111111111', '110', 'John Doe', true),
('c2222222-2222-2222-2222-222222222222', '111', 'Robert Chen', true),
('c3333333-3333-3333-3333-333333333333', '112', 'Lisa Judd', true);

-- Seed Focus-Rating Determinant Records (Current Local Base: 2026-05-28 08:00:00 UTC)

-- 1. Sarah Jenkins: 45 minutes offline ('Away from Phone'), 0 system updates -> Zero Focus Rating
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b1111111-1111-1111-1111-111111111111', 'Away from Phone', '2026-05-28 08:00:00+00', '2026-05-28 08:45:00+00');

-- 2. Marcus Vance: 15 minutes offline ('Working Tickets'), 14 system updates -> High Density (Excellent Focus Rating)
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b2222222-2222-2222-2222-222222222222', 'Working Tickets', '2026-05-28 08:00:00+00', '2026-05-28 08:15:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('b2222222-2222-2222-2222-222222222222', 'Ticket Created (#891)', '2026-05-28 08:01:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Ticket Status Changed', '2026-05-28 08:02:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Asset Record Linked', '2026-05-28 08:03:00+00'),
('b2222222-2222-2222-2222-222222222222', 'CRM Lead Transferred', '2026-05-28 08:04:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Technician Summary Written', '2026-05-28 08:05:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Workstation Config Saved', '2026-05-28 08:06:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Account Verified', '2026-05-28 08:07:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Callback Scheduled', '2026-05-28 08:08:00+00'),
('b2222222-2222-2222-2222-222222222222', 'SLA Response Acknowledged', '2026-05-28 08:09:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Internal Note Staged', '2026-05-28 08:10:00+00'),
('b2222222-2222-2222-2222-222222222222', 'CRM Status Modified', '2026-05-28 08:11:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Knowledge Base Queried', '2026-05-28 08:12:00+00'),
('b2222222-2222-2222-2222-222222222222', 'Database Record Audited', '2026-05-28 08:13:00+00'),
('b2222222-2222-2222-2222-222222222222', 'System Audit Finalized', '2026-05-28 08:14:00+00');

-- 3. Elena Rostova: 32 minutes offline ('Away from Phone'), 1 update -> Low Focus Rating (~3%)
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b3333333-3333-3333-3333-333333333333', 'Away from Phone', '2026-05-28 08:00:00+00', '2026-05-28 08:32:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('b3333333-3333-3333-3333-333333333333', 'Workstation Client Refreshed', '2026-05-28 08:15:00+00');

-- 4. David Kim: 20 minutes offline ('Working Tickets'), 9 system updates -> Good focus density (~45%)
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b4444444-4444-4444-4444-444444444444', 'Working Tickets', '2026-05-28 08:00:00+00', '2026-05-28 08:20:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('b4444444-4444-4444-4444-444444444444', 'Ticket Assigned', '2026-05-28 08:02:00+00'),
('b4444444-4444-4444-4444-444444444444', 'Workstation Client Active', '2026-05-28 08:04:00+00'),
('b4444444-4444-4444-4444-444444444444', 'Ticket Opened', '2026-05-28 08:06:00+00'),
('b4444444-4444-4444-4444-444444444444', 'Technician Note Written', '2026-05-28 08:08:00+00'),
('b4444444-4444-4444-4444-444444444444', 'Asset Tag Linked', '2026-05-28 08:10:00+00'),
('b4444444-4444-4444-4444-444444444444', 'Knowledge Base Consulted', '2026-05-28 08:12:00+00'),
('b4444444-4444-4444-4444-444444444444', 'Database Commit Received', '2026-05-28 08:14:00+00'),
('b4444444-4444-4444-4444-444444444444', 'CRM File Attachment Uploaded', '2026-05-28 08:16:00+00'),
('b4444444-4444-4444-4444-444444444444', 'Session Closed', '2026-05-28 08:18:00+00');

-- 5. Amanda Ross: 30 minutes offline, 12 system updates -> Very High density
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b5555555-5555-5555-5555-555555555555', 'Working Tickets', '2026-05-28 08:00:00+00', '2026-05-28 08:30:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('b5555555-5555-5555-5555-555555555555', 'Update A', '2026-05-28 08:02:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update B', '2026-05-28 08:04:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update C', '2026-05-28 08:06:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update D', '2026-05-28 08:08:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update E', '2026-05-28 08:10:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update F', '2026-05-28 08:12:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update G', '2026-05-28 08:14:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update H', '2026-05-28 08:16:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update I', '2026-05-28 08:18:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update J', '2026-05-28 08:20:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update K', '2026-05-28 08:22:00+00'),
('b5555555-5555-5555-5555-555555555555', 'Update L', '2026-05-28 08:24:00+00');

-- 6. Carlos Mendez: 20 minutes offline, 1 update -> Low focus
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b6666666-6666-6666-6666-666666666666', 'Away from Phone', '2026-05-28 08:00:00+00', '2026-05-28 08:20:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('b6666666-6666-6666-6666-666666666666', 'Ping', '2026-05-28 08:05:00+00');

-- 7. Rachel Green: 15 minutes offline, 6 updates -> Medium-high rating
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b7777777-7777-7777-7777-777777777777', 'Working Tickets', '2026-05-28 08:00:00+00', '2026-05-28 08:15:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('b7777777-7777-7777-7777-777777777777', 'A', '2026-05-28 08:01:00+00'),
('b7777777-7777-7777-7777-777777777777', 'B', '2026-05-28 08:03:00+00'),
('b7777777-7777-7777-7777-777777777777', 'C', '2026-05-28 08:05:00+00'),
('b7777777-7777-7777-7777-777777777777', 'D', '2026-05-28 08:07:00+00'),
('b7777777-7777-7777-7777-777777777777', 'E', '2026-05-28 08:09:00+00'),
('b7777777-7777-7777-7777-777777777777', 'F', '2026-05-28 08:11:00+00');

-- 8. James Wilson: 35 minutes offline, 1 update -> Low focus
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b8888888-8888-8888-8888-888888888888', 'Away from Phone', '2026-05-28 08:00:00+00', '2026-05-28 08:35:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('b8888888-8888-8888-8888-888888888888', 'Database Check', '2026-05-28 08:15:00+00');

-- 9. Priya Patel: 12 minutes offline, 10 updates -> Extremely Focus Dense
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('b9999999-9999-9999-9999-999999999999', 'Working Tickets', '2026-05-28 08:00:00+00', '2026-05-28 08:12:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('b9999999-9999-9999-9999-999999999999', 'U1', '2026-05-28 08:01:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U2', '2026-05-28 08:02:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U3', '2026-05-28 08:03:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U4', '2026-05-28 08:04:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U5', '2026-05-28 08:05:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U6', '2026-05-28 08:06:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U7', '2026-05-28 08:07:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U8', '2026-05-28 08:08:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U9', '2026-05-28 08:09:00+00'),
('b9999999-9999-9999-9999-999999999999', 'U10', '2026-05-28 08:10:00+00');

-- 10. John Doe: 40 minutes offline, 0 updates -> Low status
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('c1111111-1111-1111-1111-111111111111', 'Break', '2026-05-28 08:00:00+00', '2026-05-28 08:40:00+00');

-- 11. Robert Chen: 18 minutes offline, 12 updates -> Excellent
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('c2222222-2222-2222-2222-222222222222', 'Working Tickets', '2026-05-28 08:00:00+00', '2026-05-28 08:18:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('c2222222-2222-2222-2222-222222222222', 'U1', '2026-05-28 08:01:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U2', '2026-05-28 08:02:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U3', '2026-05-28 08:03:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U4', '2026-05-28 08:04:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U5', '2026-05-28 08:05:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U6', '2026-05-28 08:06:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U7', '2026-05-28 08:07:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U8', '2026-05-28 08:08:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U9', '2026-05-28 08:09:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U10', '2026-05-28 08:10:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U11', '2026-05-28 08:11:00+00'),
('c2222222-2222-2222-2222-222222222222', 'U12', '2026-05-28 08:12:00+00');

-- 12. Lisa Judd: 25 minutes offline, 15 updates -> Excellent Focus Density
INSERT INTO activity_timelines (agent_id, status_label, start_time, end_time) VALUES
('c3333333-3333-3333-3333-333333333333', 'Working Tickets', '2026-05-28 08:00:00+00', '2026-05-28 08:25:00+00');

INSERT INTO system_updates (agent_id, update_type, log_timestamp) VALUES
('c3333333-3333-3333-3333-333333333333', 'U1', '2026-05-28 08:01:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U2', '2026-05-28 08:02:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U3', '2026-05-28 08:03:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U4', '2026-05-28 08:04:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U5', '2026-05-28 08:05:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U6', '2026-05-28 08:06:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U7', '2026-05-28 08:07:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U8', '2026-05-28 08:08:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U9', '2026-05-28 08:09:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U10', '2026-05-28 08:10:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U11', '2026-05-28 08:11:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U12', '2026-05-28 08:12:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U13', '2026-05-28 08:13:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U14', '2026-05-28 08:14:00+00'),
('c3333333-3333-3333-3333-333333333333', 'U15', '2026-05-28 08:15:00+00');

-- Add three initial records to the survey_history table for immediate verification
INSERT INTO survey_history (customer_phone, call_duration_seconds, agent_extension, delivery_status, processed_at) VALUES
('+15550192834', 345, '102', 'Sent', '2026-05-28 08:10:00+00'),
('+15550144921', 42, '101', 'Skipped: Under 2 Minutes', '2026-05-28 08:12:00+00'),
('+15550178833', 180, '104', 'Skipped: Daily Cap Hit', '2026-05-28 08:14:00+00');
