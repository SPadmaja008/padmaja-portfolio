import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Award, Briefcase, Trophy, Eye, Download, Upload, X,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { DocumentItem } from '@/lib/types';

const CARDS = [
  { key: 'Resume', icon: FileText, title: 'My Resume', color: 'from-blue-500 to-cyan-500' },
  { key: 'Certifications', icon: Award, title: 'Certifications', color: 'from-indigo-500 to-purple-500' },
  { key: 'Internship Proofs', icon: Briefcase, title: 'Internship Proofs', color: 'from-emerald-500 to-teal-500' },
  { key: 'Achievements', icon: Trophy, title: 'Achievements', color: 'from-amber-500 to-orange-500' },
] as const;

interface DocumentsProps {
  documents: DocumentItem[];
}

export function Documents({ documents }: DocumentsProps) {
  const [preview, setPreview] = useState<DocumentItem | null>(null);

  return (
    <Section
      id="documents"
      title="My Achievements & Documents"
      subtitle="Explore my academic achievements, professional certifications, internship experience and resume."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((card, idx) => {
          const items = documents.filter(d => d.category === card.key);
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-5 hover:bg-white/10 transition group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{card.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{items.length} document{items.length !== 1 ? 's' : ''}</p>

              <div className="space-y-2">
                {items.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No documents uploaded yet.</p>
                )}
                {items.map(doc => (
                  <div key={doc.id} className="rounded-lg bg-slate-900/50 p-3 border border-white/5">
                    <p className="text-sm font-medium text-slate-200 truncate">{doc.title}</p>
                    {doc.file_date && <p className="text-xs text-slate-500 mt-0.5">{doc.file_date}</p>}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setPreview(doc)}
                        disabled={!doc.file_url}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 disabled:opacity-30 transition"
                      >
                        <Eye size={12} /> View
                      </button>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          download
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 transition"
                        >
                          <Download size={12} /> Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
    </Section>
  );
}

function DocumentPreview({ doc, onClose }: { doc: DocumentItem | null; onClose: () => void }) {
  if (!doc) return null;
  return (
    <Modal open={!!doc} onClose={onClose} title={doc.title} maxWidth="max-w-3xl">
      {doc.file_url ? (
        <div>
          {doc.file_type === 'pdf' ? (
            <iframe src={doc.file_url} className="w-full h-[60vh] rounded-lg" title={doc.title} />
          ) : (
            <img src={doc.file_url} alt={doc.title} className="w-full rounded-lg" />
          )}
          <div className="flex gap-3 mt-4">
            <a href={doc.file_url} download>
              <Button><Download size={16} /> Download</Button>
            </a>
            <Button variant="ghost" onClick={onClose}><X size={16} /> Close</Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Upload size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">No file uploaded for this document yet.</p>
          <p className="text-sm text-slate-600 mt-1">The owner can upload it from the admin dashboard.</p>
        </div>
      )}
    </Modal>
  );
}
