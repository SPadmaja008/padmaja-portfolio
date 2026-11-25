import { motion } from 'framer-motion';
import { Github, ExternalLink, Code2 } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import type { Platform } from '@/lib/types';

interface PlatformsProps {
  platforms: Platform[];
}

export function Platforms({ platforms }: PlatformsProps) {
  return (
    <Section id="platforms" title="Coding Platforms & Profiles">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {platforms.map((plat, idx) => {
          const hasUrl = plat.url && plat.url.length > 0;
          return (
            <motion.a
              key={plat.id}
              href={hasUrl ? plat.url : '#'}
              target={hasUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass rounded-2xl p-6 flex flex-col items-center text-center group transition ${
                hasUrl ? 'hover:bg-white/10 cursor-pointer' : 'opacity-60 cursor-default'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Github size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">{plat.name}</h3>
              {hasUrl ? (
                <span className="text-sm text-blue-400 mt-1 inline-flex items-center gap-1">
                  View Profile <ExternalLink size={12} />
                </span>
              ) : (
                <span className="text-sm text-slate-500 mt-1 inline-flex items-center gap-1">
                  <Code2 size={12} /> Profile URL not set
                </span>
              )}
            </motion.a>
          );
        })}
      </div>
    </Section>
  );
}
