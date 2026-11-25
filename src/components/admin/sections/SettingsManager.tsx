import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle, Trash2, Mail } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import type { Message } from '@/lib/types';

export function SettingsManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [deleteMsg, setDeleteMsg] = useState<Message | null>(null);

  const load = async () => {
    const [sRes, mRes] = await Promise.all([
      supabase.from('settings').select('*'),
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
    ]);
    const map: Record<string, string> = {};
    (sRes.data ?? []).forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
    setSettings(map);
    setMessages((mRes.data ?? []) as Message[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    setStatus('idle');
    const existing = await supabase.from('settings').select('id').eq('key', key).maybeSingle();
    if (existing.data) {
      await supabase.from('settings').update({ value, updated_at: new Date().toISOString() }).eq('id', existing.data.id);
    } else {
      await supabase.from('settings').insert({ key, value });
    }
    setSaving(false);
    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const removeMessage = async () => {
    if (!deleteMsg) return;
    await supabase.from('messages').delete().eq('id', deleteMsg.id);
    setDeleteMsg(null);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Website Settings</h1>
      <p className="text-slate-400 text-sm mb-6">Manage site-wide settings and view contact form messages.</p>

      {status === 'success' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-600/15 text-green-400 text-sm mb-4">
          <CheckCircle size={18} /> Setting saved.
        </div>
      )}

      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Site Settings</h2>
        <SettingRow label="Footer Text" value={settings.footer_text ?? ''} onSave={(v) => saveSetting('footer_text', v)} saving={saving} />
        <SettingRow label="Theme Accent Color" value={settings.theme_accent ?? '#3b82f6'} onSave={(v) => saveSetting('theme_accent', v)} saving={saving} />
        <SettingRow label="Navigation Label: Home" value={settings.nav_home ?? 'Home'} onSave={(v) => saveSetting('nav_home', v)} saving={saving} />
        <SettingRow label="Navigation Label: Contact" value={settings.nav_contact ?? 'Contact'} onSave={(v) => saveSetting('nav_contact', v)} saving={saving} />
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Mail size={20} /> Contact Form Messages ({messages.length})</h2>
        {messages.length === 0 ? (
          <p className="text-slate-500 text-sm">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map(m => (
              <div key={m.id} className="rounded-xl bg-slate-900/50 p-4 border border-white/5 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{m.name}</p>
                    <p className="text-xs text-blue-400">{m.email}</p>
                    <p className="text-sm text-slate-400 mt-1">{m.message}</p>
                    <p className="text-xs text-slate-600 mt-1">{new Date(m.created_at).toLocaleString()}</p>
                  </div>
                  <button onClick={() => setDeleteMsg(m)} className="p-2 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-400 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteMsg && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setDeleteMsg(null)}>
          <div className="glass-strong rounded-2xl p-6 max-w-sm" onClick={e => e.stopPropagation()}>
            <p className="text-slate-300 text-sm mb-4">Delete this message from {deleteMsg.name}?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteMsg(null)}>Cancel</Button>
              <Button variant="danger" onClick={removeMessage}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingRow({ label, value, onSave, saving }: { label: string; value: string; onSave: (v: string) => void; saving: boolean }) {
  const [val, setVal] = useState(value);
  useEffect(() => { setVal(value); }, [value]);
  return (
    <div className="flex items-end gap-3 mb-3">
      <div className="flex-1">
        <Input label={label} value={val} onChange={e => setVal(e.target.value)} />
      </div>
      <Button size="sm" onClick={() => onSave(val)} disabled={saving || val === value} className="mb-4">
        <Save size={14} /> Save
      </Button>
    </div>
  );
}
