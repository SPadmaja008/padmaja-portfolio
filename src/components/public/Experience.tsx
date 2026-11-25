import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import type { Experience } from '@/lib/types';

interface ExperienceProps {
  experience: Experience[];
}

const TYPE_ICON = {
  education: GraduationCap,
  internship: Briefcase,
  work: Award,
};

export function ExperienceTimeline({ experience }: ExperienceProps) {
  return (
    <Section id="experience" title="Experience & Education">
      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-indigo-500/50 to-transparent" />

        <div className="space-y-8">
          {experience.map((exp, idx) => {
            const Icon = TYPE_ICON[exp.type] ?? Briefcase;
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
              >
                {/* Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center ring-4 ring-slate-950">
                    <Icon size={16} className="text-white" />
                  </div>
                </div>

                {/* Card */}
                <div className={`ml-14 md:ml-0 w-full md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="glass rounded-xl p-5 hover:bg-white/10 transition">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-400 capitalize">{exp.type}</span>
                        <h3 className="text-lg font-bold text-white mt-0.5">{exp.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm flex items-center gap-1.5 mb-1">
                      <MapPin size={13} /> {exp.organization}
                    </p>
                    {exp.duration && (
                      <p className="text-slate-500 text-sm flex items-center gap-1.5 mb-2">
                        <Calendar size={13} /> {exp.duration}
                      </p>
                    )}
                    {exp.description && <p className="text-slate-400 text-sm leading-relaxed mb-2">{exp.description}</p>}
                    {exp.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {exp.technologies.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-400 border border-white/10">{t}</span>
                        ))}
                      </div>
                    )}
                    {exp.certificate_url && (
                      <a href={exp.certificate_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                        View Certificate <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
