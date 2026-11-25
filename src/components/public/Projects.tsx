import { motion } from 'framer-motion';
import { Github, ExternalLink, FolderGit2, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import type { Project } from '@/lib/types';

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <Section id="projects" title="Featured Projects">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((proj, idx) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl overflow-hidden group hover:bg-white/10 transition flex flex-col"
          >
            <div className="relative h-48 bg-slate-900 overflow-hidden flex items-center justify-center">
              {proj.image_url ? (
                <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              ) : (
                <div className="flex flex-col items-center text-slate-600">
                  <FolderGit2 size={48} />
                  <span className="text-sm mt-2">No screenshot</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{proj.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{proj.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {proj.tech_stack?.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-blue-600/15 text-blue-300 text-xs font-medium border border-blue-500/20">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <a
                  href={proj.github_url || '#'}
                  target={proj.github_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    proj.github_url ? 'glass hover:bg-white/15 text-white' : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Github size={15} /> Code
                </a>
                <a
                  href={proj.live_url || '#'}
                  target={proj.live_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    proj.live_url ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <ExternalLink size={15} /> Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
