import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Eye, Download, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Certificate } from '@/lib/types';

interface CertificationsProps {
  certificates: Certificate[];
}

export function Certifications({ certificates }: CertificationsProps) {
  const [preview, setPreview] = useState<Certificate | null>(null);

  return (
    <Section id="certifications" title="Certifications & Achievements">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="glass rounded-2xl overflow-hidden group hover:bg-white/10 transition"
          >
            <div className="relative h-36 bg-slate-900 flex items-center justify-center overflow-hidden">
              {cert.file_url ? (
                cert.file_type === 'image' ? (
                  <img src={cert.file_url} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="flex flex-col items-center text-slate-600">
                    <FileText size={40} />
                    <span className="text-xs mt-1">PDF Certificate</span>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center text-slate-600">
                  <Award size={40} />
                  <span className="text-xs mt-1">No file uploaded</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">{cert.organization}</span>
              <h3 className="text-base font-bold text-white mt-1 mb-1">{cert.title}</h3>
              {cert.completion_date && <p className="text-sm text-slate-500 mb-3">{cert.completion_date}</p>}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPreview(cert)}
                  disabled={!cert.file_url}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-white/15 text-white disabled:opacity-30 transition"
                >
                  <Eye size={13} /> View
                </button>
                {cert.file_url && (
                  <a
                    href={cert.file_url}
                    download
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-white/15 text-white transition"
                  >
                    <Download size={13} /> Download
                  </a>
                )}
                {cert.verification_url && (
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition"
                  >
                    <ExternalLink size={13} /> Verify
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title ?? ''} maxWidth="max-w-3xl">
        {preview && preview.file_url ? (
          <div>
            {preview.file_type === 'pdf' ? (
              <iframe src={preview.file_url} className="w-full h-[60vh] rounded-lg" title={preview.title} />
            ) : (
              <img src={preview.file_url} alt={preview.title} className="w-full rounded-lg" />
            )}
            <div className="flex gap-3 mt-4">
              <a href={preview.file_url} download>
                <Button><Download size={16} /> Download</Button>
              </a>
              <Button variant="ghost" onClick={() => setPreview(null)}>Close</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">No file uploaded for this certificate yet.</p>
          </div>
        )}
      </Modal>
    </Section>
  );
}
