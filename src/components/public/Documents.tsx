import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Award, Briefcase, Trophy, Eye, Download, Upload, X, ExternalLink,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { DocumentItem } from '@/lib/types';

const CARDS = [
  { key: 'Certifications', icon: Award, title: 'Certifications', color: 'from-indigo-500 to-purple-500' },
  { key: 'Internship Proofs', icon: Briefcase, title: 'Internship Proofs', color: 'from-emerald-500 to-teal-500' },
  { key: 'Achievements', icon: Trophy, title: 'Achievements', color: 'from-amber-500 to-orange-500' },
  { key: 'General', icon: FileText, title: 'Other Documents', color: 'from-slate-500 to-slate-600' },
] as const;

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentsProps {
  documents: DocumentItem[];
}

export function Documents({ documents }: DocumentsProps) {
  const [preview, setPreview] = useState<DocumentItem | null>(null);

  const resume = documents.find(d => d.category === 'Resume');
  const otherDocs = documents.filter(d => d.category !== 'Resume');

  return (
    <Section
      id="documents"
      title="My Achievements & Documents"
      subtitle="Explore my academic achievements, professional certifications, internship experience and resume."
    >
      {/* Resume highlight */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 border border-blue-500/20 hover:bg-white/10 transition group"
        >
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
              <FileText size={28} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-1">
                {resume?.title ?? 'My Resume'}
              </h3>
              <p className="text-sm text-slate-400 mb-2">
                {resume?.description || 'Download my latest resume in PDF format.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {resume?.file_date && <span>{resume.file_date}</span>}
                {resume?.file_url && formatBytes(resume.file_size) && (
                  <span>· {formatBytes(resume.file_size)}</span>
                )}
                {resume?.file_url && resume.mime_type && <span>· {resume.mime_type}</span>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {resume?.file_url ? (
                <>
                  <button
                    onClick={() => setPreview(resume)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium glass hover:bg-white/15 text-white transition"
                  >
                    <Eye size={15} /> View
                  </button>
                  <a
                    href={resume.file_url}
                    download
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition"
                  >
                    <Download size={15} /> Download
                  </a>
                </>
              ) : (
                <span className="text-sm text-slate-600 italic py-2">Resume coming soon</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Other document categories */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((card, idx) => {
          const items = otherDocs.filter(d => d.category === card.key);
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
                    {doc.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{doc.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600">
                      {doc.file_date && <span>{doc.file_date}</span>}
                      {doc.file_url && formatBytes(doc.file_size) && (
                        <span>· {formatBytes(doc.file_size)}</span>
                      )}
                    </div>
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
          {doc.description && <p className="text-sm text-slate-400 mb-3">{doc.description}</p>}
          {doc.file_type === 'pdf' ? (
            <iframe src={doc.file_url} className="w-full h-[60vh] rounded-lg" title={doc.title} />
          ) : (
            <img src={doc.file_url} alt={doc.title} className="w-full rounded-lg" />
          )}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <a href={doc.file_url} download>
              <Button><Download size={16} /> Download</Button>
            </a>
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost"><ExternalLink size={16} /> Open in new tab</Button>
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
