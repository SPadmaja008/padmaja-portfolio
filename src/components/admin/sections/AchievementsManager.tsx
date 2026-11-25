import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FileUpload } from '@/components/admin/FileUpload';
import { supabase } from '@/lib/supabase';
import type { Achievement } from '@/lib/types';

export function AchievementsManager() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [form, setForm] = useState({ title: '', description: '', event_name: '', event_date: '', proof_url: '' as string | null, verification_url: '' as string | null, sort_order: 0 });

  const load = async () => {
    const { data } = await supabase.from('achievements').select('*').order('sort_order');
    setItems((data ?? []) as Achievement[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ title: '', description: '', event_name: '', event_date: '', proof_url: null, verification_url: null, sort_order: items.length + 1 });
    setCreating(true);
  };

  const openEdit = (a: Achievement) => {
    setForm({ title: a.title, description: a.description, event_name: a.event_name, event_date: a.event_date, proof_url: a.proof_url, verification_url: a.verification_url, sort_order: a.sort_order });
    setEditing(a);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    const payload = { ...form, verification_url: form.verification_url || null };
    if (editing) {
      await supabase.from('achievements').update(payload).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('achievements').insert(payload);
      setCreating(false);
    }
    load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await supabase.from('achievements').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Achievements Management</h1>
          <p className="text-slate-400 text-sm">Manage hackathon certificates, coding achievements, and open-source contributions.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Achievement</Button>
      </div>

      <div className="space-y-3">
        {items.map(a => (
          <div key={a.id} className="glass rounded-2xl p-5 flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              {a.proof_url ? <FileText size={18} className="text-blue-400" /> : <ImageIcon size={18} className="text-slate-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white">{a.title}</h3>
              {a.event_name && <p className="text-sm text-slate-400">{a.event_name} {a.event_date && `· ${a.event_date}`}</p>}
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{a.description}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => openEdit(a)} className="p-2 rounded-lg glass hover:bg-white/15 text-white"><Pencil size={15} /></button>
              <button onClick={() => setDeleteTarget(a)} className="p-2 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-400"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-500 text-center py-8">No achievements added yet.</p>}
      </div>

      <Modal open={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} title={editing ? 'Edit Achievement' : 'Add Achievement'} maxWidth="max-w-2xl">
        <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Hackathon Winner" />
        <Textarea label="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <Input label="Event Name" value={form.event_name} onChange={e => setForm({ ...form, event_name: e.target.value })} />
        <Input label="Event Date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} placeholder="e.g. March 2025" />
        <Input label="Verification URL" value={form.verification_url ?? ''} onChange={e => setForm({ ...form, verification_url: e.target.value })} placeholder="https://..." />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Proof Document</label>
          {form.proof_url && <div className="mb-2 flex items-center gap-3"><a href={form.proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">View current</a><button onClick={() => setForm({ ...form, proof_url: null })} className="text-red-400 text-sm hover:underline">Remove</button></div>}
          <FileUpload folder="achievements" label="Upload Proof (PDF or Image)" currentUrl={form.proof_url} onUploaded={(url) => setForm({ ...form, proof_url: url })} />
        </div>
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex gap-3 pt-2">
          <Button onClick={save}><Save size={16} /> Save</Button>
          <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null); }}><X size={16} /> Cancel</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Delete "${deleteTarget?.title}"?`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
