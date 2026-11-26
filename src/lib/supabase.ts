import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const STORAGE_BUCKET = 'portfolio-documents';

export async function uploadFile(
  file: File,
  folder: string,
  oldPath?: string,
  onProgress?: (percent: number) => void
): Promise<{ url: string; path: string } | null> {
  if (oldPath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([oldPath]);
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    }, {
      onProgress: (evt) => {
        if (onProgress && evt.total && evt.total > 0) {
          onProgress(Math.min(100, Math.round((evt.loaded / evt.total) * 100)));
        }
      },
    });
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return { url: data.publicUrl, path: fileName };
}

export async function removeFile(path: string): Promise<void> {
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

export function getFilePathFromUrl(url: string): string | null {
  const parts = url.split(`/${STORAGE_BUCKET}/`);
  if (parts.length < 2) return null;
  return parts[1];
}
