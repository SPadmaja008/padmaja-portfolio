import { useEffect, useState } from 'react';
import { FolderGit2, Award, Trophy, FileText, Code2, Briefcase, Link2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OverviewProps {
  onNavigate: (s: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const [counts, setCounts] = useState({ projects: 0, certificates: 0, achievements: 0, documents: 0, skills: 0, experience: 0, platforms: 0 });

  useEffect(() => {
    (async () => {
      const [p, c, a, d, s, e, pl] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('achievements').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
        supabase.from('platforms').select('*', { count: 'exact', head: true }),
      ]);
      setCounts({
        projects: p.count ?? 0,
        certificates: c.count ?? 0,
        achievements: a.count ?? 0,
        documents: d.count ?? 0,
        skills: s.count ?? 0,
        experience: e.count ?? 0,
        platforms: pl.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: 'Projects', count: counts.projects, icon: FolderGit2, section: 'projects', color: 'from-blue-500 to-cyan-500' },
    { label: 'Certificates', count: counts.certificates, icon: Award, section: 'certificates', color: 'from-indigo-500 to-purple-500' },
    { label: 'Achievements', count: counts.achievements, icon: Trophy, section: 'achievements', color: 'from-amber-500 to-orange-500' },
    { label: 'Documents', count: counts.documents, icon: FileText, section: 'documents', color: 'from-emerald-500 to-teal-500' },
    { label: 'Skills', count: counts.skills, icon: Code2, section: 'skills', color: 'from-sky-500 to-blue-500' },
    { label: 'Experience', count: counts.experience, icon: Briefcase, section: 'experience', color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Platforms', count: counts.platforms, icon: Link2, section: 'platforms', color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
      <p className="text-slate-400 text-sm mb-6">Welcome back. Here's a summary of your portfolio content.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onNavigate(card.section)}
              className="glass rounded-2xl p-5 text-left hover:bg-white/10 transition group"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                <Icon size={22} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{card.count}</p>
              <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                {card.label} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
              </p>
            </button>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-6 mt-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('profile')} className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-white text-sm font-medium transition">Edit Home Page</button>
          <button onClick={() => onNavigate('projects')} className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-white text-sm font-medium transition">Add Project</button>
          <button onClick={() => onNavigate('certificates')} className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-white text-sm font-medium transition">Add Certificate</button>
          <button onClick={() => onNavigate('documents')} className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-white text-sm font-medium transition">Upload Resume</button>
          <button onClick={() => onNavigate('experience')} className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-white text-sm font-medium transition">Add Experience</button>
        </div>
      </div>
    </div>
  );
}
