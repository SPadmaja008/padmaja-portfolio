import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, FolderGit2, PlayCircle, BookOpen, X } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/lib/types';

interface ProjectsProps {
  projects: Project[];
}

function isYouTube(url: string): boolean {
  return /(?:youtube\.com\/watch|youtu\.be\/|youtube\.com\/embed\/)/.test(url);
}

function toYouTubeEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
}

export function Projects({ projects }: ProjectsProps) {
  const [demoProject, setDemoProject] = useState<Project | null>(null);

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
              {proj.demo_url && (
                <button
                  onClick={() => setDemoProject(proj)}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/80 transition"
                >
                  <PlayCircle size={14} /> Watch Demo
                </button>
              )}
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
              <div className="flex flex-wrap gap-2">
                {proj.github_url && (
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium glass hover:bg-white/15 text-white transition"
                  >
                    <Github size={15} /> Code
                  </a>
                )}
                {proj.live_url && (
                  <a
                    href={proj.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition"
                  >
                    <ExternalLink size={15} /> Live Demo
                  </a>
                )}
                {proj.demo_url && (
                  <button
                    onClick={() => setDemoProject(proj)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium glass hover:bg-white/15 text-white transition"
                  >
                    <PlayCircle size={15} /> Watch Demo
                  </button>
                )}
                {proj.docs_url && (
                  <a
                    href={proj.docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
                  >
                    <BookOpen size={15} /> Docs
                  </a>
                )}
                {!proj.github_url && !proj.live_url && !proj.demo_url && !proj.docs_url && (
                  <span className="text-xs text-slate-600 italic py-2">No links available</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <DemoModal project={demoProject} onClose={() => setDemoProject(null)} />
    </Section>
  );
}

function DemoModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null;
  const embed = project.demo_url ? toYouTubeEmbed(project.demo_url) : null;
  return (
    <Modal open={!!project} onClose={onClose} title={`${project.title} — Demo`} maxWidth="max-w-4xl">
      <div>
        {project.demo_url && embed && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
            <iframe
              src={embed}
              title={`${project.title} demo`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {project.demo_url && !embed && (
          <div className="flex flex-col items-center justify-center py-12">
            <PlayCircle size={48} className="text-slate-600 mb-3" />
            <p className="text-slate-400 mb-4">This demo opens in a new tab.</p>
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
              <Button><PlayCircle size={16} /> Open Demo</Button>
            </a>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost"><ExternalLink size={16} /> Open in new tab</Button>
            </a>
          )}
          <Button variant="ghost" onClick={onClose}><X size={16} /> Close</Button>
        </div>
      </div>
    </Modal>
  );
}
