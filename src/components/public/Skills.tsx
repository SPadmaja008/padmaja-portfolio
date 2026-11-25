import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Section } from '@/components/ui/Section';
import type { Skill } from '@/lib/types';

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <Section id="skills" title="Skills & Technologies">
      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat, ci) => {
          const items = skills.filter(s => s.category === cat).sort((a, b) => a.sort_order - b.sort_order);
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />
                {cat}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {items.map(skill => {
                  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[skill.icon_name] ?? Icons.Code;
                  return (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 text-sm hover:border-blue-500/40 hover:bg-blue-600/10 transition group"
                    >
                      <Icon size={16} className="text-blue-400 group-hover:scale-110 transition" />
                      {skill.name}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
