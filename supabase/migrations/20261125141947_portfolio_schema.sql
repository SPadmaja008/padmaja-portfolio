/*
# Padmaja Portfolio — Full Schema

1. Overview
Complete data layer for a personal developer portfolio with public site + admin dashboard.
Owner authenticates via Supabase email/password to manage content. Public visitors read only.

2. New Tables
- profile, skills, projects, experience, platforms, certificates, achievements,
  documents, settings, messages

3. Security
- RLS on all tables. SELECT to anon+authenticated, writes to authenticated only.
- messages: anon can INSERT (contact form), authenticated can SELECT/DELETE.

4. Notes
- Single-owner model: anyone who authenticates is the owner.
- gen_random_uuid() defaults — no sequence grants needed.
- Seeds default data (profile, skills, projects, experience, platforms, certificates, documents).
*/

-- ============ PROFILE ============
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Padmaja',
  title text NOT NULL DEFAULT 'IT Student | Full Stack Developer | Open Source Contributor',
  intro text NOT NULL DEFAULT 'Passionate about software development, building practical applications, solving real-world problems and contributing to open-source projects. I enjoy exploring new technologies and continuously improving my technical skills.',
  photo_url text,
  email text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  github_url text NOT NULL DEFAULT 'https://github.com/SPadmaja008',
  footer_text text NOT NULL DEFAULT 'Designed & Developed by Padmaja',
  meta_description text NOT NULL DEFAULT 'Portfolio of Padmaja — IT Student, Full Stack Developer, and Open Source Contributor.',
  site_title text NOT NULL DEFAULT 'Padmaja | Developer Portfolio',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON profile TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON profile TO authenticated;

DROP POLICY IF EXISTS "public_read_profile" ON profile;
CREATE POLICY "public_read_profile" ON profile FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_profile" ON profile;
CREATE POLICY "owner_insert_profile" ON profile FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_profile" ON profile;
CREATE POLICY "owner_update_profile" ON profile FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_profile" ON profile;
CREATE POLICY "owner_delete_profile" ON profile FOR DELETE TO authenticated USING (true);

-- ============ SKILLS ============
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  icon_name text DEFAULT 'Code',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON skills TO authenticated;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_skills" ON skills;
CREATE POLICY "owner_insert_skills" ON skills FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_skills" ON skills;
CREATE POLICY "owner_update_skills" ON skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_skills" ON skills;
CREATE POLICY "owner_delete_skills" ON skills FOR DELETE TO authenticated USING (true);

-- ============ PROJECTS ============
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tech_stack text[] NOT NULL DEFAULT '{}',
  image_url text,
  github_url text,
  live_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON projects TO authenticated;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_projects" ON projects;
CREATE POLICY "owner_insert_projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_projects" ON projects;
CREATE POLICY "owner_update_projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_projects" ON projects;
CREATE POLICY "owner_delete_projects" ON projects FOR DELETE TO authenticated USING (true);

-- ============ EXPERIENCE ============
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'education',
  title text NOT NULL,
  organization text NOT NULL,
  duration text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  certificate_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON experience TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON experience TO authenticated;

DROP POLICY IF EXISTS "public_read_experience" ON experience;
CREATE POLICY "public_read_experience" ON experience FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_experience" ON experience;
CREATE POLICY "owner_insert_experience" ON experience FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_experience" ON experience;
CREATE POLICY "owner_update_experience" ON experience FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_experience" ON experience;
CREATE POLICY "owner_delete_experience" ON experience FOR DELETE TO authenticated USING (true);

-- ============ PLATFORMS ============
CREATE TABLE IF NOT EXISTS platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  icon_name text DEFAULT 'Github',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON platforms TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON platforms TO authenticated;

DROP POLICY IF EXISTS "public_read_platforms" ON platforms;
CREATE POLICY "public_read_platforms" ON platforms FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_platforms" ON platforms;
CREATE POLICY "owner_insert_platforms" ON platforms FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_platforms" ON platforms;
CREATE POLICY "owner_update_platforms" ON platforms FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_platforms" ON platforms;
CREATE POLICY "owner_delete_platforms" ON platforms FOR DELETE TO authenticated USING (true);

-- ============ CERTIFICATES ============
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL DEFAULT '',
  completion_date text NOT NULL DEFAULT '',
  file_url text,
  file_type text NOT NULL DEFAULT 'pdf',
  verification_url text,
  category text NOT NULL DEFAULT 'Certifications',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON certificates TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON certificates TO authenticated;

DROP POLICY IF EXISTS "public_read_certificates" ON certificates;
CREATE POLICY "public_read_certificates" ON certificates FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_certificates" ON certificates;
CREATE POLICY "owner_insert_certificates" ON certificates FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_certificates" ON certificates;
CREATE POLICY "owner_update_certificates" ON certificates FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_certificates" ON certificates;
CREATE POLICY "owner_delete_certificates" ON certificates FOR DELETE TO authenticated USING (true);

-- ============ ACHIEVEMENTS ============
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_name text NOT NULL DEFAULT '',
  event_date text NOT NULL DEFAULT '',
  proof_url text,
  verification_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON achievements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON achievements TO authenticated;

DROP POLICY IF EXISTS "public_read_achievements" ON achievements;
CREATE POLICY "public_read_achievements" ON achievements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_achievements" ON achievements;
CREATE POLICY "owner_insert_achievements" ON achievements FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_achievements" ON achievements;
CREATE POLICY "owner_update_achievements" ON achievements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_achievements" ON achievements;
CREATE POLICY "owner_delete_achievements" ON achievements FOR DELETE TO authenticated USING (true);

-- ============ DOCUMENTS ============
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  description text NOT NULL DEFAULT '',
  file_date text NOT NULL DEFAULT '',
  file_url text,
  file_type text NOT NULL DEFAULT 'pdf',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON documents TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON documents TO authenticated;

DROP POLICY IF EXISTS "public_read_documents" ON documents;
CREATE POLICY "public_read_documents" ON documents FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_documents" ON documents;
CREATE POLICY "owner_insert_documents" ON documents FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_documents" ON documents;
CREATE POLICY "owner_update_documents" ON documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_documents" ON documents;
CREATE POLICY "owner_delete_documents" ON documents FOR DELETE TO authenticated USING (true);

-- ============ SETTINGS ============
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON settings TO authenticated;

DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_settings" ON settings;
CREATE POLICY "owner_insert_settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_update_settings" ON settings;
CREATE POLICY "owner_update_settings" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "owner_delete_settings" ON settings;
CREATE POLICY "owner_delete_settings" ON settings FOR DELETE TO authenticated USING (true);

-- ============ MESSAGES (contact form) ============
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON messages TO anon, authenticated;
GRANT SELECT, DELETE ON messages TO authenticated;

DROP POLICY IF EXISTS "public_insert_messages" ON messages;
CREATE POLICY "public_insert_messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "owner_read_messages" ON messages;
CREATE POLICY "owner_read_messages" ON messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "owner_delete_messages" ON messages;
CREATE POLICY "owner_delete_messages" ON messages FOR DELETE TO authenticated USING (true);

-- ============ SEED DEFAULT DATA ============
INSERT INTO profile (name, title, intro, github_url, email, footer_text)
SELECT 'Padmaja', 'IT Student | Full Stack Developer | Open Source Contributor',
  'Passionate about software development, building practical applications, solving real-world problems and contributing to open-source projects. I enjoy exploring new technologies and continuously improving my technical skills.',
  'https://github.com/SPadmaja008', '', 'Designed & Developed by Padmaja'
WHERE NOT EXISTS (SELECT 1 FROM profile);

INSERT INTO skills (category, name, icon_name, sort_order) VALUES
  ('Front-End', 'HTML', 'Code', 1),
  ('Front-End', 'CSS', 'Code', 2),
  ('Front-End', 'JavaScript', 'Code', 3),
  ('Programming Languages', 'C', 'Code', 1),
  ('Programming Languages', 'Java', 'Code', 2),
  ('Programming Languages', 'Python', 'Code', 3),
  ('Databases & Tools', 'MySQL', 'Database', 1),
  ('Databases & Tools', 'Git', 'GitBranch', 2),
  ('Databases & Tools', 'GitHub', 'Github', 3),
  ('Databases & Tools', 'VS Code', 'Code', 4),
  ('Other Skills', 'Data Structures', 'Code', 1),
  ('Other Skills', 'Problem Solving', 'Lightbulb', 2),
  ('Other Skills', 'Database Management', 'Database', 3),
  ('Other Skills', 'Open Source Collaboration', 'GitBranch', 4)
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, tech_stack, sort_order) VALUES
  ('Library Management System', 'A software application designed to manage library-related operations and organize book information.', ARRAY['Java','SQL'], 1),
  ('Personal Portfolio Website', 'A responsive personal website showcasing my technical skills, projects, certifications and achievements.', ARRAY['React','TypeScript','Tailwind CSS'], 2)
ON CONFLICT DO NOTHING;

INSERT INTO experience (type, title, organization, duration, description, technologies, sort_order) VALUES
  ('education', 'B.E. Information Technology', 'St. Joseph''s College of Engineering', 'Second Year', 'Pursuing a degree in Information Technology with a focus on software development, web technologies and database management.', ARRAY['IT'], 1),
  ('internship', 'Machine Learning Intern', 'GradTwin', '', 'Machine learning internship focused on practical ML development and real-world applications.', ARRAY['Python','Machine Learning'], 2)
ON CONFLICT DO NOTHING;

INSERT INTO platforms (name, url, icon_name, sort_order) VALUES
  ('GitHub', 'https://github.com/SPadmaja008', 'Github', 1),
  ('CodeChef', '', 'Code', 2),
  ('LeetCode', '', 'Code', 3)
ON CONFLICT DO NOTHING;

INSERT INTO certificates (title, organization, completion_date, file_type, category, sort_order) VALUES
  ('Java Foundation', 'Infosys Springboard', '', 'pdf', 'Certifications', 1),
  ('Database Management Systems', 'NPTEL', '62%', 'pdf', 'Certifications', 2)
ON CONFLICT DO NOTHING;

INSERT INTO documents (title, category, description, file_type, sort_order) VALUES
  ('My Resume', 'Resume', 'Download my latest resume in PDF format.', 'pdf', 1),
  ('Infosys Springboard – Java Foundation', 'Certifications', 'Java Foundation certificate from Infosys Springboard.', 'pdf', 2),
  ('NPTEL – Database Management Systems', 'Certifications', 'Database Management Systems certificate from NPTEL (62%).', 'pdf', 3),
  ('GradTwin – Machine Learning Internship', 'Internship Proofs', 'Internship completion certificate from GradTwin.', 'pdf', 4)
ON CONFLICT DO NOTHING;
