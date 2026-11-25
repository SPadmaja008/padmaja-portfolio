import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/admin/FileUpload';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

export function ProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profile').select('*').maybeSingle();
      if (data) {
        setProfile(data);
        setForm(data);
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus('idle');
    if (profile) {
      const { error } = await supabase.from('profile').update({
        name: form.name, title: form.title, intro: form.intro,
        photo_url: form.photo_url, email: form.email,
        linkedin_url: form.linkedin_url, github_url: form.github_url,
        footer_text: form.footer_text, meta_description: form.meta_description,
        site_title: form.site_title, updated_at: new Date().toISOString(),
      }).eq('id', profile.id);
      setStatus(error ? 'error' : 'success');
    } else {
      const { error } = await supabase.from('profile').insert({
        name: form.name, title: form.title, intro: form.intro,
        photo_url: form.photo_url, email: form.email,
        linkedin_url: form.linkedin_url, github_url: form.github_url,
        footer_text: form.footer_text,
      });
      setStatus(error ? 'error' : 'success');
    }
    setSaving(false);
    setTimeout(() => setStatus('idle'), 4000);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-400" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Home Page Management</h1>
      <p className="text-slate-400 text-sm mb-6">Edit your hero section, profile photo, and social links.</p>

      {status === 'success' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-600/15 text-green-400 text-sm mb-4">
          <CheckCircle size={18} /> Profile updated successfully.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-600/15 text-red-400 text-sm mb-4">
          <AlertCircle size={18} /> Failed to update. Make sure you are signed in.
        </div>
      )}

      <div className="glass rounded-2xl p-6 space-y-1">
        <Input label="Name" value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input label="Professional Title" value={form.title ?? ''} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Textarea label="Introduction" rows={3} value={form.intro ?? ''} onChange={e => setForm({ ...form, intro: e.target.value })} />

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Profile Photo</label>
          {form.photo_url && (
            <div className="mb-2 flex items-center gap-3">
              <img src={form.photo_url} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              <button onClick={() => setForm({ ...form, photo_url: null })} className="text-red-400 text-sm hover:underline">Remove</button>
            </div>
          )}
          <FileUpload folder="profile" accept="image/*" label="Upload Profile Photo" currentUrl={form.photo_url} onUploaded={(url) => setForm({ ...form, photo_url: url })} />
        </div>

        <Input label="Email" value={form.email ?? ''} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Input label="LinkedIn URL" value={form.linkedin_url ?? ''} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} />
        <Input label="GitHub URL" value={form.github_url ?? ''} onChange={e => setForm({ ...form, github_url: e.target.value })} />
        <Input label="Footer Text" value={form.footer_text ?? ''} onChange={e => setForm({ ...form, footer_text: e.target.value })} />
        <Input label="Site Title (SEO)" value={form.site_title ?? ''} onChange={e => setForm({ ...form, site_title: e.target.value })} />
        <Textarea label="Meta Description (SEO)" rows={2} value={form.meta_description ?? ''} onChange={e => setForm({ ...form, meta_description: e.target.value })} />

        <div className="pt-2">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
