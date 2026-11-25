import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/lib/types';

const CATEGORIES = ['Front-End', 'Programming Languages', 'Databases & Tools', 'Other Skills'];

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [form, setForm] = useState({ category: CATEGORIES[0], name: '', icon_name: 'Code', sort_order: 0 });

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('sort_order');
    setSkills((data ?? []) as Skill[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ category: CATEGORIES[0], name: '', icon_name: 'Code', sort_order: skills.length + 1 });
    setCreating(true);
  };

  const openEdit = (s: Skill) => {
    setForm({ category: s.category, name: s.name, icon_name: s.icon_name, sort_order: s.sort_order });
    setEditing(s);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    if (editing) {
      await supabase.from('skills').update(form).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('skills').insert(form);
      setCreating(false);
    }
    setForm({ category: CATEGORIES[0], name: '', icon_name: 'Code', sort_order: 0 });
    load();
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await supabase.from('skills').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Skills Management</h1>
          <p className="text-slate-400 text-sm">Add, edit, and organize your skills by category.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Skill</Button>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map(cat => {
          const items = skills.filter(s => s.category === cat);
          return (
            <div key={cat} className="glass rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-3">{cat}</h3>
              {items.length === 0 ? (
                <p className="text-slate-500 text-sm">No skills in this category.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {items.map(s => (
                    <div key={s.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-white/10 group">
                      <span className="text-sm text-slate-200">{s.name}</span>
                      <span className="text-xs text-slate-600">#{s.sort_order}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-blue-400"><Pencil size={13} /></button>
                        <button onClick={() => setDeleteTarget(s)} className="text-slate-400 hover:text-red-400"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <Input label="Skill Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. JavaScript" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Icon Name (Lucide icon)" value={form.icon_name} onChange={e => setForm({ ...form, icon_name: e.target.value })} placeholder="e.g. Code, Database, Github" />
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
        <div className="flex gap-3 pt-2">
          <Button onClick={save}><Save size={16} /> Save</Button>
          <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null); }}><X size={16} /> Cancel</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
