export interface Profile {
  id: string;
  name: string;
  title: string;
  intro: string;
  photo_url: string | null;
  email: string;
  linkedin_url: string;
  github_url: string;
  footer_text: string;
  meta_description: string;
  site_title: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  icon_name: string;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  type: 'education' | 'internship' | 'work';
  title: string;
  organization: string;
  duration: string;
  description: string;
  technologies: string[];
  certificate_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
  icon_name: string;
  sort_order: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  completion_date: string;
  file_url: string | null;
  file_type: 'pdf' | 'image';
  verification_url: string | null;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  event_name: string;
  event_date: string;
  proof_url: string | null;
  verification_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  file_date: string;
  file_url: string | null;
  file_type: 'pdf' | 'image';
  sort_order: number;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
