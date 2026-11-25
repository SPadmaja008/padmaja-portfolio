import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-28 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">{title}</h2>
          {subtitle && <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">{subtitle}</p>}
          <div className="mt-4 h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
        </motion.div>
        {children}
      </div>
    </section>
  );
}
