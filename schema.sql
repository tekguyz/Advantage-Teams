-- =============================================================================
-- SQL SCHEMA DEFINITION: 3CX Operations Telemetry & Automated Survey Suite
-- Author: Principal Database Engineer
-- Database Engine: PostgreSQL 14+ / Supabase
-- Description:
--   High-performance relational schema for ingestion of direct call logs and 
--   telemetry streams from 3CX. State is hosted locally (Supabase compatible)
--   with robust indexing for real-time productivity querying & database-level
--   suppression constraints.
-- =============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PART 1: DROP TABLES (FOR CLEAN MIGRATIONS)
-- =============================================================================
DROP TABLE IF EXISTS pending_surveys CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS telemetry_logs CASCADE;
DROP TABLE IF EXISTS agent_profiles CASCADE;

-- =============================================================================
-- PART 2: AUTOMATED TIMESTAMP TRIGGER FUNCTIONS
-- =============================================================================

-- Standard function to automatically update 'updated_at' on any row mutation
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PART 3: DEFINITIONS OF TABLES
-- =============================================================================

-- 1. Table: agent_profiles
-- Represents the internal team agents handling calls.
-- 3CX extension is the natural unique key used by telephony equipment.
CREATE TABLE agent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    extension VARCHAR(20) NOT NULL UNIQUE, -- 3CX extension string
    zoho_user_id VARCHAR(100) NOT NULL, -- For downstream references/mapping
    agent_name VARCHAR(150) NOT NULL CONSTRAINT chk_agent_name_length CHECK (char_length(trim(agent_name)) >= 2),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: telemetry_logs
-- Ingests real-time client status ticks from 3CX desktop/app streams.
-- Tracking productivity slots ('Ticket Work', 'On Call', 'Available', 'Away').
CREATE TABLE telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agent_profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CONSTRAINT chk_status_length CHECK (char_length(trim(status)) >= 2),
    start_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_timestamp TIMESTAMPTZ, -- Nullable if status is currently active
    duration_seconds INTEGER GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_timestamp - start_timestamp))::INTEGER
    ) STORED, -- Computed duration in seconds when end_timestamp is written
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Database rule guardrails
    CONSTRAINT chk_timestamps_order CHECK (end_timestamp IS NULL OR end_timestamp >= start_timestamp)
);

-- 3. Table: activity_logs
-- Captures discrete actions performed within the telemetry workspace.
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agent_profiles(id) ON DELETE CASCADE,
    platform_action_type VARCHAR(100) NOT NULL CONSTRAINT chk_platform_action_not_empty CHECK (char_length(trim(platform_action_type)) >= 2),
    precise_action_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata TEXT NOT NULL DEFAULT '{}', -- Enforced metadata text constraint
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: pending_surveys
-- Holds outgoing post-call customer satisfaction surveys queued by the system.
CREATE TABLE pending_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_phone VARCHAR(30) NOT NULL CONSTRAINT chk_phone_format CHECK (char_length(trim(customer_phone)) >= 5),
    call_duration_seconds INTEGER NOT NULL CONSTRAINT chk_duration_positive CHECK (call_duration_seconds >= 0),
    agent_extension VARCHAR(20) NOT NULL REFERENCES agent_profiles(extension) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    queue_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Enforce valid status values via check constraint
    CONSTRAINT chk_survey_status CHECK (status IN ('pending', 'sent', 'suppressed'))
);

-- =============================================================================
-- PART 4: SYSTEM GUARDRAILS (DEDUPLICATION & AUTO-SUPPRESSION TRIGGERS)
-- =============================================================================

-- Pre-insert and Pre-update Survey Ingestion Rule logic:
-- Any record written to 'pending_surveys' is auto-evaluated.
-- Rule 1: Flag as 'suppressed' if dial_duration is under 120 seconds.
-- Rule 2: Flag as 'suppressed' if the customer’s phone has been queued/registered
--         for another survey in the preceding 24-hour window.
CREATE OR REPLACE FUNCTION tg_process_survey_suppression_rules()
RETURNS TRIGGER AS $$
DECLARE
    found_recent BOOLEAN := FALSE;
BEGIN
    -- Rule 1: Short Calls Suppression (Duration < 120 seconds)
    IF NEW.call_duration_seconds < 120 THEN
        NEW.status := 'suppressed';
        RETURN NEW;
    END IF;

    -- Rule 2: 24-Hour Deduplication Window
    -- Check if another survey was queued for the same phone number in the past 24 hours of this queue action
    SELECT EXISTS (
        SELECT 1 
        FROM pending_surveys 
        WHERE customer_phone = NEW.customer_phone
          AND queue_timestamp >= (NEW.queue_timestamp - INTERVAL '24 hours')
          AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) INTO found_recent;

    IF found_recent THEN
        NEW.status := 'suppressed';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pending_surveys_suppression
BEFORE INSERT OR UPDATE ON pending_surveys
FOR EACH ROW
EXECUTE FUNCTION tg_process_survey_suppression_rules();

-- =============================================================================
-- PART 5: TIMESTAMPTZ UPDATED_AT TRIGGERS ASSEMBLY
-- =============================================================================
CREATE TRIGGER trg_set_timestamp_agent_profiles BEFORE UPDATE ON agent_profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER trg_set_timestamp_telemetry_logs BEFORE UPDATE ON telemetry_logs FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER trg_set_timestamp_activity_logs BEFORE UPDATE ON activity_logs FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER trg_set_timestamp_pending_surveys BEFORE UPDATE ON pending_surveys FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================================================
-- PART 6: HIGH-PERFORMANCE INDEXING STRATEGY
-- =============================================================================

-- Optimization for real-time productivity dashboard query.
-- Queries frequently calculate productivity gaps by filtering telemetry_logs 
-- within specific TIMESTAMPTZ windows for active/inactive agents.
-- We use robust B-tree indices on telemetry_logs' timestamps and state identifiers.

-- Index 1: Co-indexed lookup of live status durations and ranges (crucial for productivity lookups)
CREATE INDEX idx_telemetry_agent_time_window 
ON telemetry_logs (agent_id, start_timestamp, end_timestamp desc, status);

-- Index 2: Indexing on ongoing (active) telemetry logs (where end_timestamp is null)
CREATE INDEX idx_telemetry_live_tracking 
ON telemetry_logs (agent_id) 
WHERE end_timestamp IS NULL;

-- Index 3: Precise action timeline tracing index (bento grids & chronological audit logging)
CREATE INDEX idx_activity_agent_chronology 
ON activity_logs (agent_id, precise_action_timestamp DESC);

-- Index 4: High-frequency phone matching to optimize the trigger's 24-hr deduplication checks
CREATE INDEX idx_pending_surveys_dedup 
ON pending_surveys (customer_phone, queue_timestamp DESC);

-- Index 5: 3CX Agent extension search index (highly selective on alphanumeric format)
CREATE INDEX idx_agent_extension_lookup 
ON agent_profiles (extension);
