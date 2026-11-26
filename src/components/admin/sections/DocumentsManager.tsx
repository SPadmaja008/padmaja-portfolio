import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, FileText, Image as ImageIcon, Download, Eye, AlertCircle, FileWarning } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FileUpload } from '@/components/admin/FileUpload';
import { supabase, removeFile, getFilePathFromUrl, STORAGE_BUCKET } from '@/lib/supabase';
import type { DocumentItem } from '@/lib/types';

const CATEGORIES = ['Resume', 'Certifications', 'Internship Proofs', 'Achievements', 'General'];
const RESUME_CATEGORY = 'Resume';

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocForm {
  title: string;
  category: string;
  description: string;
  file_date: string;
  file_url: string | null;
  file_type: 'pdf' | 'image';
  file_size: number | null;
  mime_type: string | null;
  file_path: string | null;
  sort_order: number;
}

const EMPTY_FORM: DocForm = {
  title: '', category: 'Resume', description: '', file_date: '',
  file_url: null, file_type: 'pdf', file_size: null, mime_type: null,
  file_path: null, sort_order: 0,
};

export function DocumentsManager() {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DocumentItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);
  const [preview, setPreview] = useState<DocumentItem | null>(null);
  const [form, setForm] = useState<DocForm>(EMPTY_FORM);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('documents').select('*').order('sort_order');
    setItems((data ?? []) as DocumentItem[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, sort_order: items.length + 1 });
    setSaveError('');
    setCreating(true);
  };

  const openEdit = (d: DocumentItem) => {
    setForm({
      title: d.title, category: d.category, description: d.description,
      file_date: d.file_date, file_url: d.file_url, file_type: d.file_type,
      file_size: d.file_size, mime_type: d.mime_type,
      file_path: d.file_url ? getFilePathFromUrl(d.file_url) : null,
      sort_order: d.sort_order,
    });
    setSaveError('');
    setEditing(d);
  };

  const save = async () => {
    if (!form.title.trim()) {
      setSaveError('Title is required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    const payload = {
      title: form.title, category: form.category, description: form.description,
      file_date: form.file_date, file_url: form.file_url, file_type: form.file_type,
      file_size: form.file_size, mime_type: form.mime_type, sort_order: form.sort_order,
    };
    let error: { message: string } | null = null;
    if (editing) {
      const res = await supabase.from('documents').update(payload).eq('id', editing.id);
      error = res.error;
      if (!error) setEditing(null);
    } else {
      const res = await supabase.from('documents').insert(payload);
      error = res.error;
      if (!error) setCreating(false);
    }
    if (error) setSaveError(error.message);
    setSaving(false);
    if (!error) load();
  };

  const removeFileOnly = async (d: DocumentItem) => {
    if (!d.file_url) return;
    const path = getFilePathFromUrl(d.file_url);
    if (path) await removeFile(path);
    await supabase.from('documents').update({ file_url: null, file_size: null, mime_type: null }).eq('id', d.id);
    load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.file_url) {
      const path = getFilePathFromUrl(deleteTarget.file_url);
      if (path) await removeFile(path);
    }
    await supabase.from('documents').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const resume = items.find(d => d.category === RESUME_CATEGORY);
  const resumeCount = items.filter(d => d.category === RESUME_CATEGORY).length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Documents Management</h1>
          <p className="text-slate-400 text-sm">Upload, replace, and delete your resume, certificates, and other documents.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Document</Button>
      </div>

      {/* Resume highlight card */}
      <div className="glass rounded-2xl p-5 mb-6 border border-blue-500/20">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
            <FileText size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-bold text-white">Resume</h3>
            <p className="text-sm text-slate-400 mt-0.5">
              {resume?.file_url
                ? `Current resume: ${resume.title}${resume.file_date ? ` (${resume.file_date})` : ''}${formatBytes(resume.file_size) ? ` · ${formatBytes(resume.file_size)}` : ''}`
                : 'No resume uploaded yet. Add a document in the Resume category and upload a PDF.'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {resume?.file_url && (
              <>
                <a href={resume.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm glass hover:bg-white/15 text-white">
                  <Eye size={14} /> View
                </a>
                <a href={resume.file_url} download className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white">
                  <Download size={14} /> Download
                </a>
                <button onClick={() => openEdit(resume)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm glass hover:bg-white/15 text-white">
                  <Pencil size={14} /> Replace
                </button>
              </>
            )}
            {!resume?.file_url && (
              <Button size="sm" onClick={openCreate}><Plus size={14} /> Upload Resume</Button>
            )}
          </div>
        </div>
        {resumeCount > 1 && (
          <p className="text-xs text-amber-400 mt-3 flex items-center gap-1.5">
            <FileWarning size={12} /> You have {resumeCount} documents in the Resume category. Only the first is shown here.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map(cat => {
          const catItems = items.filter(d => d.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat} className="glass rounded-2xl p-4">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wide mb-3">{cat}</h3>
              <div className="space-y-2">
                {catItems.map(d => (
                  <div key={d.id} className="rounded-lg bg-slate-900/50 p-3 border border-white/5 group">
                    <div className="flex items-start gap-2">
                      {d.file_url ? (d.file_type === 'image' ? <ImageIcon size={16} className="text-blue-400 mt-0.5" /> : <FileText size={16} className="text-blue-400 mt-0.5" />) : <FileText size={16} className="text-slate-600 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{d.title}</p>
                        <p className="text-xs text-slate-500">
                          {d.file_date && <span>{d.file_date}</span>}
                          {d.file_date && d.file_url && <span> · </span>}
                          {d.file_url && formatBytes(d.file_size) && <span>{formatBytes(d.file_size)}</span>}
                          {!d.file_url && <span className="italic">No file attached</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {d.file_url && <button onClick={() => setPreview(d)} className="flex items-center gap-1 px-2 py-1 rounded text-xs glass hover:bg-white/15 text-white"><Eye size={11} /> View</button>}
                      {d.file_url && <a href={d.file_url} download className="flex items-center gap-1 px-2 py-1 rounded text-xs glass hover:bg-white/15 text-white"><Download size={11} /> Download</a>}
                      <button onClick={() => openEdit(d)} className="flex items-center gap-1 px-2 py-1 rounded text-xs glass hover:bg-white/15 text-white"><Pencil size={11} /> Edit</button>
                      {d.file_url && <button onClick={() => removeFileOnly(d)} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-600/15 hover:bg-amber-600/30 text-amber-400"><Trash2 size={11} /> Remove File</button>}
                      <button onClick={() => setDeleteTarget(d)} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-600/15 hover:bg-red-600/30 text-red-400"><Trash2 size={11} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-slate-500 col-span-full text-center py-8">No documents uploaded yet.</p>}
      </div>

      <Modal open={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} title={editing ? 'Edit Document' : 'Add Document'} maxWidth="max-w-2xl">
        <Input label="Document Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Textarea label="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <Input label="Date" value={form.file_date} onChange={e => setForm({ ...form, file_date: e.target.value })} placeholder="e.g. June 2025" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            File {form.file_url && <span className="text-slate-500 font-normal">(replace or remove)</span>}
          </label>
          {form.file_url && (
            <div className="mb-2 flex items-center gap-3 flex-wrap">
              <a href={form.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1"><Eye size={13} /> View current</a>
              <span className="text-xs text-slate-500">
                {form.file_type === 'image' ? 'Image' : 'PDF'}{formatBytes(form.file_size) ? ` · ${formatBytes(form.file_size)}` : ''}
              </span>
              <button onClick={() => setForm({ ...form, file_url: null, file_size: null, mime_type: null, file_path: null })} className="text-red-400 text-sm hover:underline">Remove file</button>
            </div>
          )}
          <FileUpload
            folder="documents"
            accept={form.category === RESUME_CATEGORY ? '.pdf' : '.pdf,.jpg,.jpeg,.png,.gif,.webp'}
            allowedTypes={form.category === RESUME_CATEGORY
              ? ['application/pdf']
              : ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']}
            currentUrl={form.file_url}
            label={form.category === RESUME_CATEGORY ? 'Upload Resume (PDF only)' : 'Upload File (PDF, JPG, PNG)'}
            helperText={form.category === RESUME_CATEGORY
              ? 'PDF files only. Up to 10 MB.'
              : 'PDF or image files. Up to 10 MB.'}
            onUploaded={(url, path, fileType, meta) => setForm({
              ...form, file_url: url, file_type: fileType, file_path: path,
              file_size: meta.size, mime_type: meta.mime,
            })}
          />
        </div>
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />

        {saveError && (
          <div className="mb-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} /> {saveError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
          </Button>
          <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null); }}><X size={16} /> Cancel</Button>
        </div>
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title ?? ''} maxWidth="max-w-3xl">
        {preview && preview.file_url && (
          <div>
            {preview.file_type === 'pdf' ? <iframe src={preview.file_url} className="w-full h-[60vh] rounded-lg" title={preview.title} /> : <img src={preview.file_url} alt={preview.title} className="w-full rounded-lg" />}
            <div className="flex gap-3 mt-4"><a href={preview.file_url} download><Button><Download size={16} /> Download</Button></a><Button variant="ghost" onClick={() => setPreview(null)}>Close</Button></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Delete "${deleteTarget?.title}"? This also removes the attached file and cannot be undone.`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
