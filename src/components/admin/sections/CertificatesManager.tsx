import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, Search, FileText, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FileUpload } from '@/components/admin/FileUpload';
import { supabase } from '@/lib/supabase';
import type { Certificate } from '@/lib/types';

export function CertificatesManager() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', organization: '', completion_date: '', file_url: '' as string | null, file_type: 'pdf' as 'pdf' | 'image', verification_url: '', category: 'Certifications', sort_order: 0 });

  const load = async () => {
    const { data } = await supabase.from('certificates').select('*').order('sort_order');
    setItems((data ?? []) as Certificate[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ title: '', organization: '', completion_date: '', file_url: null, file_type: 'pdf', verification_url: '', category: 'Certifications', sort_order: items.length + 1 });
    setCreating(true);
  };

  const openEdit = (c: Certificate) => {
    setForm({ title: c.title, organization: c.organization, completion_date: c.completion_date, file_url: c.file_url, file_type: c.file_type, verification_url: c.verification_url ?? '', category: c.category, sort_order: c.sort_order });
    setEditing(c);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    const payload = { ...form, verification_url: form.verification_url || null };
    if (editing) {
      await supabase.from('certificates').update(payload).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('certificates').insert(payload);
      setCreating(false);
    }
    load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await supabase.from('certificates').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const filtered = items.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.organization.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Certificates Management</h1>
          <p className="text-slate-400 text-sm">Upload and manage your certificates.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Certificate</Button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search certificates..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="glass rounded-2xl p-4 group">
            <div className="h-24 bg-slate-900 rounded-lg flex items-center justify-center mb-3">
              {c.file_url ? (c.file_type === 'image' ? <img src={c.file_url} alt={c.title} className="w-full h-full object-cover rounded-lg" /> : <FileText size={28} className="text-slate-600" />) : <ImageIcon size={28} className="text-slate-600" />}
            </div>
            <p className="text-xs text-blue-400">{c.organization}</p>
            <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{c.title}</h3>
            {c.completion_date && <p className="text-xs text-slate-500 mb-2">{c.completion_date}</p>}
            <div className="flex gap-1">
              <button onClick={() => openEdit(c)} className="flex items-center gap-1 px-2 py-1 rounded text-xs glass hover:bg-white/15 text-white"><Pencil size={11} /> Edit</button>
              <button onClick={() => setDeleteTarget(c)} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-600/15 hover:bg-red-600/30 text-red-400"><Trash2 size={11} /> Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-slate-500 col-span-full text-center py-8">No certificates found.</p>}
      </div>

      <Modal open={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} title={editing ? 'Edit Certificate' : 'Add Certificate'} maxWidth="max-w-2xl">
        <Input label="Certificate Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Input label="Issuing Organization" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} />
        <Input label="Completion Date" value={form.completion_date} onChange={e => setForm({ ...form, completion_date: e.target.value })} placeholder="e.g. June 2025 or 62%" />
        <Input label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Certifications" />
        <Input label="Verification URL" value={form.verification_url} onChange={e => setForm({ ...form, verification_url: e.target.value })} placeholder="https://..." />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Certificate File</label>
          {form.file_url && <div className="mb-2 flex items-center gap-3"><a href={form.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">View current</a><button onClick={() => setForm({ ...form, file_url: null })} className="text-red-400 text-sm hover:underline">Remove</button></div>}
          <FileUpload folder="certificates" label="Upload Certificate (PDF or Image)" currentUrl={form.file_url} onUploaded={(url, _path, fileType) => setForm({ ...form, file_url: url, file_type: fileType })} />
        </div>
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex gap-3 pt-2">
          <Button onClick={save}><Save size={16} /> Save</Button>
          <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null); }}><X size={16} /> Cancel</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Delete certificate "${deleteTarget?.title}"?`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
