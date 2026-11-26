/*
# Upgrade Projects and Documents for richer resource management

1. Overview
This migration extends the existing `projects` and `documents` tables to support:
  - Project resource links: a demo video URL and an optional documentation URL.
  - Document file metadata: stored file size (bytes) and MIME type, so the public
    site and admin can render file info and validate uploads.
No new tables are created. No existing data, columns, policies, or grants are
removed or changed. Existing RLS and storage policies remain in effect.

2. Modified Tables
  - `projects`
      + `demo_url` (text, nullable)  -> URL to a project demonstration video
        (YouTube or other supported video link).
      + `docs_url` (text, nullable)  -> Optional URL to project documentation.
        Both columns default to NULL so existing project rows are unaffected.
  - `documents`
      + `file_size`  (bigint, nullable) -> Size of the uploaded file in bytes.
      + `mime_type`  (text, nullable)   -> MIME type of the uploaded file
        (e.g. application/pdf, image/png). Used for display and validation.
        Both columns default to NULL so existing document rows are unaffected.

3. Security
  - No changes to Row Level Security. All existing policies remain in effect:
      * projects:  public SELECT (anon, authenticated); authenticated-only INSERT/UPDATE/DELETE.
      * documents: public SELECT (anon, authenticated); authenticated-only INSERT/UPDATE/DELETE.
  - No grants are changed. The new columns inherit the table-level grants already
    present (anon SELECT; authenticated full CRUD), so no additional GRANT is needed.
  - Storage bucket `portfolio-documents` and its policies (public read,
    authenticated write/update/delete) are unchanged. Only authenticated admin
    users can upload, replace, or delete files; public visitors can only read
    files intended to be public.

4. Important Notes
  - This migration is idempotent: each ALTER TABLE ... ADD COLUMN is wrapped in a
    DO $$ ... IF NOT EXISTS ... END $$ guard, so re-running is safe.
  - No data is dropped, renamed, or retyped. Existing rows keep working.
  - The frontend will start sending demo_url / docs_url for projects and
    file_size / mime_type for documents; older rows simply have NULL for these,
    which the UI treats as "not provided".
*/

-- Add demo_url and docs_url to projects (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'demo_url') THEN
    ALTER TABLE public.projects ADD COLUMN demo_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'docs_url') THEN
    ALTER TABLE public.projects ADD COLUMN docs_url text;
  END IF;
END $$;

-- Add file_size and mime_type to documents (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'file_size') THEN
    ALTER TABLE public.documents ADD COLUMN file_size bigint;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'mime_type') THEN
    ALTER TABLE public.documents ADD COLUMN mime_type text;
  END IF;
END $$;
