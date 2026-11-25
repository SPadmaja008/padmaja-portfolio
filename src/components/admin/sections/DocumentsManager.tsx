import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, FileText, Image as ImageIcon, Download, Eye } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FileUpload } from '@/components/admin/FileUpload';
import { supabase } from '@/lib/supabase';
import type { DocumentItem } from '@/lib/types';

const CATEGORIES = ['Resume', 'Certifications', 'Internship Proofs', 'Achievements', 'General'];

export function DocumentsManager() {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DocumentItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);
  const [preview, setPreview] = useState<DocumentItem | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Resume', description: '', file_date: '', file_url: '' as string | null, file_type: 'pdf' as 'pdf' | 'image', sort_order: 0 });

  const load = async () => {
    const { data } = await supabase.from('documents').select('*').order('sort_order');
    setItems((data ?? []) as DocumentItem[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ title: '', category: 'Resume', description: '', file_date: '', file_url: null, file_type: 'pdf', sort_order: items.length + 1 });
    setCreating(true);
  };

  const openEdit = (d: DocumentItem) => {
    setForm({ title: d.title, category: d.category, description: d.description, file_date: d.file_date, file_url: d.file_url, file_type: d.file_type, sort_order: d.sort_order });
    setEditing(d);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    if (editing) {
      await supabase.from('documents').update(form).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('documents').insert(form);
      setCreating(false);
    }
    load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await supabase.from('documents').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Documents Management</h1>
          <p className="text-slate-400 text-sm">Upload and manage your resume, certificates, and other documents.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Document</Button>
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
                        {d.file_date && <p className="text-xs text-slate-500">{d.file_date}</p>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {d.file_url && <button onClick={() => setPreview(d)} className="flex items-center gap-1 px-2 py-1 rounded text-xs glass hover:bg-white/15 text-white"><Eye size={11} /> View</button>}
                      {d.file_url && <a href={d.file_url} download className="flex items-center gap-1 px-2 py-1 rounded text-xs glass hover:bg-white/15 text-white"><Download size={11} /> Download</a>}
                      <button onClick={() => openEdit(d)} className="flex items-center gap-1 px-2 py-1 rounded text-xs glass hover:bg-white/15 text-white"><Pencil size={11} /> Edit</button>
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
          <label className="block text-sm font-medium text-slate-300 mb-1.5">File</label>
          {form.file_url && <div className="mb-2 flex items-center gap-3"><a href={form.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">View current</a><button onClick={() => setForm({ ...form, file_url: null })} className="text-red-400 text-sm hover:underline">Remove</button></div>}
          <FileUpload folder="documents" label="Upload File (PDF, JPG, PNG)" currentUrl={form.file_url} onUploaded={(url, _path, fileType) => setForm({ ...form, file_url: url, file_type: fileType })} />
        </div>
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex gap-3 pt-2">
          <Button onClick={save}><Save size={16} /> Save</Button>
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

      <ConfirmDialog open={!!deleteTarget} message={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
