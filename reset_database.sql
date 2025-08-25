-- Reset database completely
-- Drop all tables in correct order (child tables first, then parent tables)

-- Drop child tables first
DROP TABLE IF EXISTS ticket_approvals CASCADE;
DROP TABLE IF EXISTS approval_tasks CASCADE;
DROP TABLE IF EXISTS approval_workflows CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS form_templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop parent tables
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS priority_levels CASCADE;
DROP TABLE IF EXISTS ticket_status CASCADE;
DROP TABLE IF EXISTS field_types CASCADE;

-- Now run the sample_data.sql script after this
