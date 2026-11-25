import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { supabase } from '@/lib/supabase';
import type { Platform } from '@/lib/types';

export function PlatformsManager() {
  const [items, setItems] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Platform | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Platform | null>(null);
  const [form, setForm] = useState({ name: '', url: '', icon_name: 'Github', sort_order: 0 });

  const load = async () => {
    const { data } = await supabase.from('platforms').select('*').order('sort_order');
    setItems((data ?? []) as Platform[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ name: '', url: '', icon_name: 'Github', sort_order: items.length + 1 });
    setCreating(true);
  };

  const openEdit = (p: Platform) => {
    setForm({ name: p.name, url: p.url, icon_name: p.icon_name, sort_order: p.sort_order });
    setEditing(p);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    if (editing) {
      await supabase.from('platforms').update(form).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('platforms').insert(form);
      setCreating(false);
    }
    load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await supabase.from('platforms').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Coding Platforms</h1>
          <p className="text-slate-400 text-sm">Manage your coding platform profile links.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Platform</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className="glass rounded-2xl p-5 group">
            <h3 className="font-bold text-white mb-1">{p.name}</h3>
            <p className="text-sm text-slate-500 truncate mb-3">{p.url || 'No URL set'}</p>
            <div className="flex gap-2">
              {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs glass hover:bg-white/15 text-white"><ExternalLink size={12} /> Visit</a>}
              <button onClick={() => openEdit(p)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs glass hover:bg-white/15 text-white"><Pencil size={12} /> Edit</button>
              <button onClick={() => setDeleteTarget(p)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-red-600/15 hover:bg-red-600/30 text-red-400"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-500 col-span-full text-center py-8">No platforms added yet.</p>}
      </div>

      <Modal open={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} title={editing ? 'Edit Platform' : 'Add Platform'}>
        <Input label="Platform Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. LeetCode" />
        <Input label="Profile URL" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://leetcode.com/yourusername" />
        <Input label="Icon Name (Lucide)" value={form.icon_name} onChange={e => setForm({ ...form, icon_name: e.target.value })} placeholder="Github, Code, Trophy" />
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex gap-3 pt-2">
          <Button onClick={save}><Save size={16} /> Save</Button>
          <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null); }}><X size={16} /> Cancel</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Delete "${deleteTarget?.name}"?`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
