import { Navbar } from '@/components/ui/Navbar';
import { Hero } from '@/components/public/Hero';
import { Documents } from '@/components/public/Documents';
import { About } from '@/components/public/About';
import { Skills } from '@/components/public/Skills';
import { Projects } from '@/components/public/Projects';
import { ExperienceTimeline } from '@/components/public/Experience';
import { Platforms } from '@/components/public/Platforms';
import { Certifications } from '@/components/public/Certifications';
import { Contact } from '@/components/public/Contact';
import { Footer } from '@/components/public/Footer';
import { usePortfolioData } from '@/lib/usePortfolioData';

export function Portfolio() {
  const data = usePortfolioData();
  const resumeDoc = data.documents.find(d => d.category === 'Resume');
  const resumeUrl = resumeDoc?.file_url ?? null;

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero profile={data.profile} resumeUrl={resumeUrl} />
      <Documents documents={data.documents} />
      <About profile={data.profile} experience={data.experience} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <ExperienceTimeline experience={data.experience} />
      <Platforms platforms={data.platforms} />
      <Certifications certificates={data.certificates} />
      <Contact profile={data.profile} />
      <Footer profile={data.profile} />
    </div>
  );
}
