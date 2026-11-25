import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Profile, Skill, Project, Experience, Platform,
  Certificate, Achievement, DocumentItem,
} from '@/lib/types';

const TABLES = {
  profile: 'profile',
  skills: 'skills',
  projects: 'projects',
  experience: 'experience',
  platforms: 'platforms',
  certificates: 'certificates',
  achievements: 'achievements',
  documents: 'documents',
} as const;

type TableName = keyof typeof TABLES;
type RowType =
  | Profile | Skill | Project | Experience | Platform
  | Certificate | Achievement | DocumentItem;

export function usePortfolioData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [
        pRes, sRes, prRes, eRes, plRes, cRes, aRes, dRes,
      ] = await Promise.all([
        supabase.from(TABLES.profile).select('*').maybeSingle(),
        supabase.from(TABLES.skills).select('*').order('sort_order'),
        supabase.from(TABLES.projects).select('*').order('sort_order'),
        supabase.from(TABLES.experience).select('*').order('sort_order'),
        supabase.from(TABLES.platforms).select('*').order('sort_order'),
        supabase.from(TABLES.certificates).select('*').order('sort_order'),
        supabase.from(TABLES.achievements).select('*').order('sort_order'),
        supabase.from(TABLES.documents).select('*').order('sort_order'),
      ]);
      if (cancelled) return;
      const anyError = [pRes, sRes, prRes, eRes, plRes, cRes, aRes, dRes].find(r => r.error);
      if (anyError?.error) {
        setError(anyError.error.message);
      }
      if (pRes.data) setProfile(pRes.data as Profile);
      setSkills((sRes.data ?? []) as Skill[]);
      setProjects((prRes.data ?? []) as Project[]);
      setExperience((eRes.data ?? []) as Experience[]);
      setPlatforms((plRes.data ?? []) as Platform[]);
      setCertificates((cRes.data ?? []) as Certificate[]);
      setAchievements((aRes.data ?? []) as Achievement[]);
      setDocuments((dRes.data ?? []) as DocumentItem[]);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return {
    profile, skills, projects, experience, platforms,
    certificates, achievements, documents,
    loading, error,
  };
}

// Generic CRUD helper for admin
export async function insertRow(table: TableName, data: Partial<RowType>) {
  return supabase.from(TABLES[table]).insert(data).select().single();
}
export async function updateRow(table: TableName, id: string, data: Partial<RowType>) {
  return supabase.from(TABLES[table]).update(data).eq('id', id).select().single();
}
export async function deleteRow(table: TableName, id: string) {
  return supabase.from(TABLES[table]).delete().eq('id', id);
}
