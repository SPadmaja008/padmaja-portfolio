import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/supabase';

interface FileUploadProps {
  folder: string;
  accept?: string;
  onUploaded: (url: string, path: string, fileType: 'pdf' | 'image') => void;
  label?: string;
  currentUrl?: string | null;
}

export function FileUpload({ folder, accept = '.pdf,.jpg,.jpeg,.png', onUploaded, label = 'Upload File', currentUrl }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setLoading(true);
    setError('');
    const oldPath = currentUrl ? currentUrl.split(`/${'portfolio-documents'}/`)[1] : undefined;
    const result = await uploadFile(file, folder, oldPath);
    if (result) {
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
      onUploaded(result.url, result.path, isImage ? 'image' : 'pdf');
    } else {
      setError('Upload failed. Make sure you are signed in.');
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/15 hover:border-blue-500/50 text-slate-400 hover:text-white transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        {loading ? 'Uploading...' : label}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
