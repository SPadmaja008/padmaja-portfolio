import { motion } from 'framer-motion';
import { Github, Linkedin, Download, ArrowRight, FolderGit2 } from 'lucide-react';
import type { Profile } from '@/lib/types';

interface HeroProps {
  profile: Profile | null;
  resumeUrl?: string | null;
}

export function Hero({ profile, resumeUrl }: HeroProps) {
  const name = profile?.name ?? 'Padmaja';
  const title = profile?.title ?? 'IT Student | Full Stack Developer | Open Source Contributor';
  const intro = profile?.intro ?? '';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center py-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Welcome to my portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Hi, I'm <span className="gradient-text">{name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 mb-4 font-medium"
          >
            {title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            {intro}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6"
          >
            <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-95">
              Get In Touch <ArrowRight size={18} />
            </a>
            <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-all active:scale-95">
              <FolderGit2 size={18} /> View My Work
            </a>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-all active:scale-95">
                <Download size={18} /> Resume
              </a>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3 justify-center lg:justify-start"
          >
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl glass hover:bg-blue-600/20 text-slate-400 hover:text-white transition">
                <Github size={22} />
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl glass hover:bg-blue-600/20 text-slate-400 hover:text-white transition">
                <Linkedin size={22} />
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-2xl opacity-40 animate-glow" />
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full p-1.5 bg-gradient-to-tr from-blue-500 to-indigo-500 animate-float">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-bold gradient-text">P</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
