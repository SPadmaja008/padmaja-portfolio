import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, Search, Github, ExternalLink } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FileUpload } from '@/components/admin/FileUpload';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', description: '', tech_stack: '' as string, image_url: '' as string | null, github_url: '', live_url: '', sort_order: 0 });

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects((data ?? []) as Project[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ title: '', description: '', tech_stack: '', image_url: null, github_url: '', live_url: '', sort_order: projects.length + 1 });
    setCreating(true);
  };

  const openEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, tech_stack: p.tech_stack.join(', '), image_url: p.image_url, github_url: p.github_url ?? '', live_url: p.live_url ?? '', sort_order: p.sort_order });
    setEditing(p);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title, description: form.description,
      tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
      image_url: form.image_url, github_url: form.github_url || null,
      live_url: form.live_url || null, sort_order: form.sort_order,
    };
    if (editing) {
      await supabase.from('projects').update(payload).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('projects').insert(payload);
      setCreating(false);
    }
    load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await supabase.from('projects').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projects Management</h1>
          <p className="text-slate-400 text-sm">Add, edit, and manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Project</Button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="glass rounded-2xl overflow-hidden group">
            <div className="h-32 bg-slate-900 flex items-center justify-center">
              {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <span className="text-slate-600 text-sm">No screenshot</span>}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-2">{p.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {p.tech_stack?.slice(0, 3).map((t, i) => <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-blue-600/15 text-blue-300">{t}</span>)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs glass hover:bg-white/15 text-white"><Pencil size={12} /> Edit</button>
                <button onClick={() => setDeleteTarget(p)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-red-600/15 hover:bg-red-600/30 text-red-400"><Trash2 size={12} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-slate-500 col-span-full text-center py-8">No projects found.</p>}
      </div>

      <Modal open={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} title={editing ? 'Edit Project' : 'Add Project'} maxWidth="max-w-2xl">
        <Input label="Project Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Textarea label="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <Input label="Tech Stack (comma separated)" value={form.tech_stack} onChange={e => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, TypeScript, Tailwind" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Screenshot</label>
          {form.image_url && <div className="mb-2 flex items-center gap-3"><img src={form.image_url} alt="Screenshot" className="w-20 h-12 rounded object-cover" /><button onClick={() => setForm({ ...form, image_url: null })} className="text-red-400 text-sm hover:underline">Remove</button></div>}
          <FileUpload folder="projects" accept="image/*" label="Upload Screenshot" currentUrl={form.image_url} onUploaded={(url) => setForm({ ...form, image_url: url })} />
        </div>
        <Input label="GitHub URL" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
        <Input label="Live Demo URL" value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." />
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex gap-3 pt-2">
          <Button onClick={save}><Save size={16} /> Save</Button>
          <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null); }}><X size={16} /> Cancel</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Delete project "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
