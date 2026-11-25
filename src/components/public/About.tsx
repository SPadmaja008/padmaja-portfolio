import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import type { Profile, Experience } from '@/lib/types';

interface AboutProps {
  profile: Profile | null;
  experience: Experience[];
}

export function About({ profile, experience }: AboutProps) {
  const edu = experience.find(e => e.type === 'education');

  return (
    <Section id="about" title="About Me">
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 glass rounded-2xl p-6 md:p-8"
        >
          <p className="text-slate-300 leading-relaxed text-base md:text-lg mb-4">
            I'm an Information Technology student at St. Joseph's College of Engineering with a strong interest in software development, web technologies, database management and problem-solving.
          </p>
          <p className="text-slate-400 leading-relaxed">
            I enjoy building practical applications, learning new technologies and contributing to open-source projects. I continuously work on improving my technical knowledge through projects, coding practice and real-world development experiences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 gradient-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Education</h3>
          </div>
          {edu ? (
            <div>
              <p className="text-white font-semibold">{edu.title}</p>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                <MapPin size={14} /> {edu.organization}
              </p>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
                <Calendar size={14} /> {edu.duration}
              </p>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Education details not available.</p>
          )}
        </motion.div>
      </div>
    </Section>
  );
}
