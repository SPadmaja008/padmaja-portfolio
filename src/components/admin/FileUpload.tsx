import { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '@/lib/supabase';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface FileUploadProps {
  folder: string;
  accept?: string;
  allowedTypes?: readonly string[];
  onUploaded: (url: string, path: string, fileType: 'pdf' | 'image', meta: { size: number; mime: string }) => void;
  label?: string;
  currentUrl?: string | null;
  helperText?: string;
}

const DEFAULT_ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function detectType(file: File): 'pdf' | 'image' {
  if (file.type.startsWith('image/')) return 'image';
  return 'pdf';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  folder,
  accept = '.pdf,.jpg,.jpeg,.png',
  allowedTypes = DEFAULT_ALLOWED,
  onUploaded,
  label = 'Upload File',
  currentUrl,
  helperText,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File is too large (${formatBytes(file.size)}). Maximum allowed is ${formatBytes(MAX_FILE_SIZE)}.`;
    }
    const allowed = allowedTypes.includes(file.type) ||
      allowedTypes.some((t) => t.endsWith('/*') && file.type.startsWith(t.slice(0, -1)));
    if (!allowed) {
      return 'Unsupported file type. Please upload a PDF or image file.';
    }
    return null;
  };

  const handleFile = async (file: File) => {
    setError('');
    setSuccess('');
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setProgress(0);
    const oldPath = currentUrl ? currentUrl.split(`/${'portfolio-documents'}/`)[1] : undefined;
    const result = await uploadFile(file, folder, oldPath, (p) => setProgress(p));
    if (result) {
      const fileType = detectType(file);
      onUploaded(result.url, result.path, fileType, { size: file.size, mime: file.type });
      setSuccess(`${file.name} uploaded successfully (${formatBytes(file.size)}).`);
      setProgress(100);
    } else {
      setError('Upload failed. Make sure you are signed in and try again.');
    }
    setLoading(false);
  };

  const inputId = `file-upload-${folder}`;

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      <label
        htmlFor={inputId}
        className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/15 hover:border-blue-500/50 text-slate-400 hover:text-white transition flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        {loading ? `Uploading... ${progress}%` : label}
      </label>

      {helperText && !loading && !error && !success && (
        <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>
      )}

      {loading && (
        <div className="mt-2">
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{progress}% uploaded</p>
        </div>
      )}

      {success && !loading && (
        <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs">
          <CheckCircle2 size={14} /> {success}
        </div>
      )}

      {error && !loading && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {currentUrl && !loading && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          {accept.includes('image') ? <ImageIcon size={12} /> : <FileText size={12} />}
          <span>A file is currently attached.</span>
        </div>
      )}
    </div>
  );
}
