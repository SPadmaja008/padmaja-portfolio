import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, GraduationCap, Briefcase, Award } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FileUpload } from '@/components/admin/FileUpload';
import { supabase } from '@/lib/supabase';
import type { Experience } from '@/lib/types';

const TYPES = ['education', 'internship', 'work'] as const;
const TYPE_ICON = { education: GraduationCap, internship: Briefcase, work: Award };

export function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [form, setForm] = useState({ type: 'education' as string, title: '', organization: '', duration: '', description: '', technologies: '', certificate_url: '' as string | null, sort_order: 0 });

  const load = async () => {
    const { data } = await supabase.from('experience').select('*').order('sort_order');
    setItems((data ?? []) as Experience[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ type: 'education', title: '', organization: '', duration: '', description: '', technologies: '', certificate_url: null, sort_order: items.length + 1 });
    setCreating(true);
  };

  const openEdit = (e: Experience) => {
    setForm({ type: e.type, title: e.title, organization: e.organization, duration: e.duration, description: e.description, technologies: e.technologies.join(', '), certificate_url: e.certificate_url, sort_order: e.sort_order });
    setEditing(e);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    const payload = {
      type: form.type, title: form.title, organization: form.organization,
      duration: form.duration, description: form.description,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      certificate_url: form.certificate_url || null, sort_order: form.sort_order,
    };
    if (editing) {
      await supabase.from('experience').update(payload).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('experience').insert(payload);
      setCreating(false);
    }
    load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await supabase.from('experience').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Experience Management</h1>
          <p className="text-slate-400 text-sm">Manage education, internships, and work experience.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Entry</Button>
      </div>

      <div className="space-y-3">
        {items.map(e => {
          const Icon = TYPE_ICON[e.type] ?? Briefcase;
          return (
            <div key={e.id} className="glass rounded-2xl p-5 flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-400">{e.type}</span>
                <h3 className="font-bold text-white">{e.title}</h3>
                <p className="text-sm text-slate-400">{e.organization} {e.duration && `· ${e.duration}`}</p>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{e.description}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => openEdit(e)} className="p-2 rounded-lg glass hover:bg-white/15 text-white"><Pencil size={15} /></button>
                <button onClick={() => setDeleteTarget(e)} className="p-2 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-slate-500 text-center py-8">No experience entries yet.</p>}
      </div>

      <Modal open={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} title={editing ? 'Edit Entry' : 'Add Entry'} maxWidth="max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Input label="Title / Role" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Machine Learning Intern" />
        <Input label="Organization" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} placeholder="e.g. GradTwin" />
        <Input label="Duration" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. June 2025 - Aug 2025" />
        <Textarea label="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <Input label="Technologies (comma separated)" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="Python, Machine Learning" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Certificate / Proof</label>
          {form.certificate_url && <div className="mb-2 flex items-center gap-3"><a href={form.certificate_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">View current</a><button onClick={() => setForm({ ...form, certificate_url: null })} className="text-red-400 text-sm hover:underline">Remove</button></div>}
          <FileUpload folder="experience" label="Upload Certificate" currentUrl={form.certificate_url} onUploaded={(url) => setForm({ ...form, certificate_url: url })} />
        </div>
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex gap-3 pt-2">
          <Button onClick={save}><Save size={16} /> Save</Button>
          <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null); }}><X size={16} /> Cancel</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
