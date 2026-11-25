/*
# Storage bucket for portfolio documents and images

1. Creates a public storage bucket `portfolio-documents`.
2. Sets policies: public read, authenticated write/delete.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-documents', 'portfolio-documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_portfolio_docs" ON storage.objects;
CREATE POLICY "public_read_portfolio_docs"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-documents');

DROP POLICY IF EXISTS "auth_insert_portfolio_docs" ON storage.objects;
CREATE POLICY "auth_insert_portfolio_docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-documents');

DROP POLICY IF EXISTS "auth_update_portfolio_docs" ON storage.objects;
CREATE POLICY "auth_update_portfolio_docs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-documents')
WITH CHECK (bucket_id = 'portfolio-documents');

DROP POLICY IF EXISTS "auth_delete_portfolio_docs" ON storage.objects;
CREATE POLICY "auth_delete_portfolio_docs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-documents');
