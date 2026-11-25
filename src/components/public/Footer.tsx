import { Github, Linkedin, Mail } from 'lucide-react';
import type { Profile } from '@/lib/types';

interface FooterProps {
  profile: Profile | null;
}

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="border-t border-white/10 py-8 px-4 bg-slate-950">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-slate-400 text-sm">© 2026 {profile?.name ?? 'Padmaja'}. All Rights Reserved.</p>
          <p className="text-slate-600 text-xs mt-0.5">{profile?.footer_text ?? 'Designed & Developed by Padmaja'}</p>
        </div>
        <div className="flex gap-3">
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass hover:bg-blue-600/20 text-slate-400 hover:text-white transition">
              <Github size={18} />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg glass hover:bg-blue-600/20 text-slate-400 hover:text-white transition">
              <Linkedin size={18} />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="p-2.5 rounded-lg glass hover:bg-blue-600/20 text-slate-400 hover:text-white transition">
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
