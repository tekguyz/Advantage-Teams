-- =============================================================================
-- SQL SEED DATA: Advantage Teams Operations Ingestion & Survey Mapping Matrix
-- Description:
--   Populates the datastore with the Master Matrix for agents, activity profiles,
--   and Post-Call Outreach Survey status lines.
-- =============================================================================

-- Clean existing database tables in correct referential order
TRUNCATE TABLE pending_surveys CASCADE;
TRUNCATE TABLE activity_logs CASCADE;
TRUNCATE TABLE telemetry_logs CASCADE;
TRUNCATE TABLE agent_profiles CASCADE;

-- 1. SEEDING AGENT PROFILES
-- Master Matrix alignment: Sarah Jenkins, Marcus Vance, Elena Rostova, David Kim
INSERT INTO agent_profiles (id, extension, zoho_user_id, agent_name, active, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', '101', 'US-101', 'Sarah Jenkins', true, '2026-05-27 08:00:00+00', '2026-05-27 08:00:00+00'),
('a2222222-2222-2222-2222-222222222222', '102', 'US-102', 'Marcus Vance', true, '2026-05-27 08:00:00+00', '2026-05-27 08:00:00+00'),
('a3333333-3333-3333-3333-333333333333', '103', 'US-103', 'Elena Rostova', true, '2026-05-27 08:00:00+00', '2026-05-27 08:00:00+00'),
('a4444444-4444-4444-4444-444444444444', '104', 'US-104', 'David Kim', true, '2026-05-27 08:00:00+00', '2026-05-27 08:00:00+00');

-- 2. SEEDING TELEMETRY STATUS LOGS
-- Sarah Jenkins - Away from Phone (45 mins)
INSERT INTO telemetry_logs (id, agent_id, status, start_timestamp, end_timestamp) VALUES
('b101-0001', 'a1111111-1111-1111-1111-111111111111', 'Away from Phone', '2026-05-27 15:15:00+00', NULL);

-- Marcus Vance - Ticket Work (15 mins)
INSERT INTO telemetry_logs (id, agent_id, status, start_timestamp, end_timestamp) VALUES
('b102-0001', 'a2222222-2222-2222-2222-222222222222', 'Ticket Work', '2026-05-27 15:45:00+00', NULL);

-- Elena Rostova - Away from Phone (32 mins)
INSERT INTO telemetry_logs (id, agent_id, status, start_timestamp, end_timestamp) VALUES
('b103-0001', 'a3333333-3333-3333-3333-333333333333', 'Away from Phone', '2026-05-27 15:28:00+00', NULL);

-- David Kim - Ticket Work (20 mins)
INSERT INTO telemetry_logs (id, agent_id, status, start_timestamp, end_timestamp) VALUES
('b104-0001', 'a4444444-4444-4444-4444-444444444444', 'Ticket Work', '2026-05-27 15:40:00+00', NULL);

-- 3. SEEDING DISCRETE SYSTEM UPDATES (activity_logs)
-- Marcus Vance has 14 system updates, David Kim has 9, Elena Rostova has 1, Sarah Jenkins has 0
INSERT INTO activity_logs (agent_id, platform_action_type, precise_action_timestamp, metadata) VALUES
-- Elena Rostova (1 action)
('a3333333-3333-3333-3333-333333333333', 'Ticket Status Modified', '2026-05-27 15:30:00+00', '{"ticket_id": "ZOHO-INC-8392", "new_status": "Escalated"}'),

-- David Kim (9 actions)
('a4444444-4444-4444-4444-444444444444', 'Workstation Client Pinged', '2026-05-27 15:41:00+00', '{}'),
('a4444444-4444-4444-4444-444444444444', 'Zoho Record Sync Executed', '2026-05-27 15:42:00+00', '{"module": "Contacts"}'),
('a4444444-4444-4444-4444-444444444444', 'CRM Contact Checked', '2026-05-27 15:43:00+00', '{"contact_id": "Z-55261"}'),
('a4444444-4444-4444-4444-444444444444', '3CX Log Stream Attached', '2026-05-27 15:44:00+00', '{"channel": "104-sip"}'),
('a4444444-4444-4444-4444-444444444444', 'Ticket Opened', '2026-05-27 15:45:00+00', '{"ticket_id": "INC-00918"}'),
('a4444444-4444-4444-4444-444444444444', 'Agent Notes Ingested', '2026-05-27 15:46:00+00', '{"length_chars": 230}'),
('a4444444-4444-4444-4444-444444444444', 'Zoho Account Bound', '2026-05-27 15:47:00+00', '{"account_id": "ACC-99211"}'),
('a4444444-4444-4444-4444-444444444444', 'Client Callback Initiated', '2026-05-27 15:48:00+00', '{"phone": "+15550178833"}'),
('a4444444-4444-4444-4444-444444444444', 'Database Commit Completed', '2026-05-27 15:49:00+00', '{"rows_affected": 1}'),

-- Marcus Vance (14 actions)
('a2222222-2222-2222-2222-222222222222', 'CRM Lead Processed', '2026-05-27 15:46:00+00', '{"lead_id": "L-901"}'),
('a2222222-2222-2222-2222-222222222222', 'Zoho Ticket Created', '2026-05-27 15:46:20+00', '{"ticket_id": "INC-00811"}'),
('a2222222-2222-2222-2222-222222222222', '3CX Active Call Attached', '2026-05-27 15:46:40+00', '{"duration_sec": 345}'),
('a2222222-2222-2222-2222-222222222222', 'Verification Token Logged', '2026-05-27 15:47:00+00', '{"token_hash": "sha256"}'),
('a2222222-2222-2222-2222-222222222222', 'Ticket Field Modified', '2026-05-27 15:47:20+00', '{"field": "Priority", "value": "High"}'),
('a2222222-2222-2222-2222-222222222222', 'Manager Checklist Met', '2026-05-27 15:47:40+00', '{"checks_completed": 4}'),
('a2222222-2222-2222-2222-222222222222', 'Outbound Routing Linked', '2026-05-27 15:48:00+00', '{"route_id": "3cx-out-02"}'),
('a2222222-2222-2222-2222-222222222222', 'Zoho Profile Revalidated', '2026-05-27 15:48:20+00', '{"mapped_id": "US-102"}'),
('a2222222-2222-2222-2222-222222222222', 'Call Record Hook Dispatched', '2026-05-27 15:48:40+00', '{"survey_id": "s1"}'),
('a2222222-2222-2222-2222-222222222222', 'Zoho Account Queried', '2026-05-27 15:49:00+00', '{"account_name": "Acme Corp"}'),
('a2222222-2222-2222-2222-222222222222', 'Task Entry Finalized', '2026-05-27 15:49:20+00', '{"task_id": "T-3091"}'),
('a2222222-2222-2222-2222-222222222222', 'Workstation Active Ping', '2026-05-27 15:49:40+00', '{}'),
('a2222222-2222-2222-2222-222222222222', 'Audit Sequence Confirmed', '2026-05-27 15:50:00+00', '{"sequence": 22}'),
('a2222222-2222-2222-2222-222222222222', 'Outbound Pipeline Ingested', '2026-05-27 15:50:20+00', '{"status": "Completed"}');

-- 4. SEEDING PENDING SURVEYS LOGS (Master Matrix: sent or suppressed)
-- Survey Log 1: Marcus Vance (Ext: 102) -> Sent
INSERT INTO pending_surveys (id, customer_phone, call_duration_seconds, agent_extension, status, queue_timestamp) VALUES
('s1111111-1111-1111-1111-111111111111', '+1 (555) 019-2834', 345, '102', 'sent', '2026-05-27 15:45:00+00');

-- Survey Log 2: Sarah Jenkins (Ext: 101) -> Skipped: Under 2 Minutes (2-Minute Minimum Filter)
-- Note: inserting with call duration 42 will automatically trigger database suppression if triggers run, 
-- but we can explicitly set status to suppressed or pending and let triggers / manual code state map it.
INSERT INTO pending_surveys (id, customer_phone, call_duration_seconds, agent_extension, status, queue_timestamp, suppression_reason) VALUES
('s2222222-2222-2222-2222-222222222222', '+1 (555) 014-4921', 42, '101', 'suppressed', '2026-05-27 15:20:00+00', '25-Minute Minimum Ingestion Filter Bypass');

-- To avoid database trigger override if the trigger set it to 'suppressed' but we want to display exactly
-- the human suppression explanation: "2-Minute Minimum Filter", we will configure the database to support this.
UPDATE pending_surveys SET status = 'suppressed', suppression_reason = '2-Minute Minimum Filter' WHERE id = 's2222222-2222-2222-2222-222222222222';

-- Survey Log 3: David Kim (Ext: 104) -> Skipped: Daily Cap Hit (Daily Message Cap)
INSERT INTO pending_surveys (id, customer_phone, call_duration_seconds, agent_extension, status, queue_timestamp, suppression_reason) VALUES
('s3333333-3333-3333-3333-333333333333', '+1 (555) 017-8833', 180, '104', 'suppressed', '2026-05-27 15:42:00+00', 'Daily Message Cap');
