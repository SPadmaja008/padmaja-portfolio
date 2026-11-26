import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, Search, Github, ExternalLink, PlayCircle, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FileUpload } from '@/components/admin/FileUpload';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';

function isValidUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

interface ProjectForm {
  title: string;
  description: string;
  tech_stack: string;
  image_url: string | null;
  github_url: string;
  live_url: string;
  demo_url: string;
  docs_url: string;
  sort_order: number;
}

const EMPTY_FORM: ProjectForm = {
  title: '', description: '', tech_stack: '', image_url: null,
  github_url: '', live_url: '', demo_url: '', docs_url: '', sort_order: 0,
};

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects((data ?? []) as Project[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, sort_order: projects.length + 1 });
    setErrors({});
    setSaveError('');
    setCreating(true);
  };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title, description: p.description,
      tech_stack: p.tech_stack.join(', '), image_url: p.image_url,
      github_url: p.github_url ?? '', live_url: p.live_url ?? '',
      demo_url: p.demo_url ?? '', docs_url: p.docs_url ?? '',
      sort_order: p.sort_order,
    });
    setErrors({});
    setSaveError('');
    setEditing(p);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!isValidUrl(form.github_url)) next.github_url = 'Enter a valid http(s) URL.';
    if (!isValidUrl(form.live_url)) next.live_url = 'Enter a valid http(s) URL.';
    if (!isValidUrl(form.demo_url)) next.demo_url = 'Enter a valid http(s) URL.';
    if (!isValidUrl(form.docs_url)) next.docs_url = 'Enter a valid http(s) URL.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError('');
    const payload = {
      title: form.title, description: form.description,
      tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
      image_url: form.image_url, github_url: form.github_url || null,
      live_url: form.live_url || null, demo_url: form.demo_url || null,
      docs_url: form.docs_url || null, sort_order: form.sort_order,
    };
    let error: { message: string } | null = null;
    if (editing) {
      const res = await supabase.from('projects').update(payload).eq('id', editing.id);
      error = res.error;
      if (!error) setEditing(null);
    } else {
      const res = await supabase.from('projects').insert(payload);
      error = res.error;
      if (!error) setCreating(false);
    }
    if (error) setSaveError(error.message);
    setSaving(false);
    if (!error) load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await supabase.from('projects').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  const linkBadges = (p: Project) => {
    const links = [
      { icon: Github, label: 'Code', present: !!p.github_url },
      { icon: ExternalLink, label: 'Live', present: !!p.live_url },
      { icon: PlayCircle, label: 'Demo', present: !!p.demo_url },
      { icon: BookOpen, label: 'Docs', present: !!p.docs_url },
    ];
    return (
      <div className="flex flex-wrap gap-1.5">
        {links.map((l) => (
          <span
            key={l.label}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
              l.present ? 'bg-blue-600/15 text-blue-300' : 'bg-slate-800/50 text-slate-600'
            }`}
          >
            <l.icon size={11} /> {l.label}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projects Management</h1>
          <p className="text-slate-400 text-sm">Add, edit, and manage your portfolio projects with links to code, demos, and docs.</p>
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
              <div className="mb-3">{linkBadges(p)}</div>
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border ${errors.title ? 'border-red-500/60' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50`} />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>
        <Textarea label="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <Input label="Tech Stack (comma separated)" value={form.tech_stack} onChange={e => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, TypeScript, Tailwind" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Screenshot</label>
          {form.image_url && <div className="mb-2 flex items-center gap-3"><img src={form.image_url} alt="Screenshot" className="w-20 h-12 rounded object-cover" /><button onClick={() => setForm({ ...form, image_url: null })} className="text-red-400 text-sm hover:underline">Remove</button></div>}
          <FileUpload folder="projects" accept="image/*" allowedTypes={['image/*']} currentUrl={form.image_url} onUploaded={(url) => setForm({ ...form, image_url: url })} label="Upload Screenshot (PNG, JPG, WebP)" helperText="Images only. Up to 10 MB." />
        </div>

        <div className="grid sm:grid-cols-2 gap-x-4">
          <UrlField label="GitHub Repository URL" icon={Github} value={form.github_url} error={errors.github_url}
            onChange={v => setForm({ ...form, github_url: v })} placeholder="https://github.com/username/repo" />
          <UrlField label="Live Demo URL" icon={ExternalLink} value={form.live_url} error={errors.live_url}
            onChange={v => setForm({ ...form, live_url: v })} placeholder="https://your-app.vercel.app" />
          <UrlField label="Demo Video URL (YouTube or video link)" icon={PlayCircle} value={form.demo_url} error={errors.demo_url}
            onChange={v => setForm({ ...form, demo_url: v })} placeholder="https://www.youtube.com/watch?v=..." />
          <UrlField label="Documentation URL (optional)" icon={BookOpen} value={form.docs_url} error={errors.docs_url}
            onChange={v => setForm({ ...form, docs_url: v })} placeholder="https://docs.example.com" />
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

      <ConfirmDialog open={!!deleteTarget} message={`Delete project "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

function UrlField({
  label, icon: Icon, value, error, onChange, placeholder,
}: {
  label: string; icon: typeof Github; value: string; error?: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
        <Icon size={14} /> {label}
      </label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border ${error ? 'border-red-500/60' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50`} />
      {error ? (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> {error}</p>
      ) : (
        <p className="text-emerald-500/60 text-xs mt-1 flex items-center gap-1"><CheckCircle2 size={11} /> {value.trim() ? 'Valid URL' : 'Optional'}</p>
      )}
    </div>
  );
}
