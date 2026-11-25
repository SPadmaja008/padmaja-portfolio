import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

interface ContactProps {
  profile: Profile | null;
}

export function Contact({ profile }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const { error } = await supabase.from('messages').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <Section id="contact" title="Get In Touch" subtitle="I'm always interested in connecting with developers, exploring opportunities and collaborating on meaningful projects.">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 md:p-8 space-y-4"
        >
          <h3 className="text-xl font-bold text-white mb-2">Connect with me</h3>
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 hover:bg-white/10 transition group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"><Mail size={18} className="text-white" /></div>
              <div><p className="text-xs text-slate-500">Email</p><p className="text-sm text-white">{profile.email}</p></div>
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center"><Linkedin size={18} className="text-white" /></div>
              <div><p className="text-xs text-slate-500">LinkedIn</p><p className="text-sm text-white truncate">{profile.linkedin_url}</p></div>
            </a>
          )}
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center"><Github size={18} className="text-white" /></div>
              <div><p className="text-xs text-slate-500">GitHub</p><p className="text-sm text-white truncate">{profile.github_url}</p></div>
            </a>
          )}
          {!profile?.email && !profile?.linkedin_url && (
            <p className="text-sm text-slate-500">Contact links will appear here once the owner sets them up.</p>
          )}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 md:p-8"
        >
          <form onSubmit={submit} className="space-y-1">
            <Input
              label="Your Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-400 text-xs -mt-3 mb-2">{errors.name}</p>}
            <Input
              label="Your Email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs -mt-3 mb-2">{errors.email}</p>}
            <Textarea
              label="Message"
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Your message..."
            />
            {errors.message && <p className="text-red-400 text-xs -mt-3 mb-2">{errors.message}</p>}

            {status === 'success' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-600/15 text-green-400 text-sm mb-2">
                <CheckCircle size={18} /> Your message has been sent. Thank you!
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-600/15 text-red-400 text-sm mb-2">
                <AlertCircle size={18} /> Could not send message. Please try again later.
              </div>
            )}

            <Button type="submit" size="lg" disabled={status === 'sending'} className="w-full">
              <Send size={18} /> {status === 'sending' ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </motion.div>
      </div>
    </Section>
  );
}
