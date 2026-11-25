import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Code2, FolderGit2, Briefcase, Link2,
  Award, Trophy, FileText, Settings, LogOut, Menu, X, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { Overview } from '@/components/admin/sections/Overview';
import { ProfileManager } from '@/components/admin/sections/ProfileManager';
import { SkillsManager } from '@/components/admin/sections/SkillsManager';
import { ProjectsManager } from '@/components/admin/sections/ProjectsManager';
import { ExperienceManager } from '@/components/admin/sections/ExperienceManager';
import { PlatformsManager } from '@/components/admin/sections/PlatformsManager';
import { CertificatesManager } from '@/components/admin/sections/CertificatesManager';
import { AchievementsManager } from '@/components/admin/sections/AchievementsManager';
import { DocumentsManager } from '@/components/admin/sections/DocumentsManager';
import { SettingsManager } from '@/components/admin/sections/SettingsManager';

type SectionId =
  | 'overview' | 'profile' | 'skills' | 'projects' | 'experience'
  | 'platforms' | 'certificates' | 'achievements' | 'documents' | 'settings';

const NAV: { id: SectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Home Page', icon: User },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'platforms', label: 'Platforms', icon: Link2 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminDashboard() {
  const { signOut } = useAuth();
  const [active, setActive] = useState<SectionId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (active) {
      case 'overview': return <Overview onNavigate={(s) => setActive(s as SectionId)} />;
      case 'profile': return <ProfileManager />;
      case 'skills': return <SkillsManager />;
      case 'projects': return <ProjectsManager />;
      case 'experience': return <ExperienceManager />;
      case 'platforms': return <PlatformsManager />;
      case 'certificates': return <CertificatesManager />;
      case 'achievements': return <AchievementsManager />;
      case 'documents': return <DocumentsManager />;
      case 'settings': return <SettingsManager />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass border-r border-white/10 z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <span className="text-lg font-bold gradient-text">Admin Panel</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={20} /></button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  active === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} /> {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 space-y-1">
          <a href="#/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition">
            <ExternalLink size={18} /> View Site
          </a>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-600/15 transition">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 glass border-b border-white/10 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-300"><Menu size={22} /></button>
          <span className="font-bold text-white">Admin Panel</span>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
