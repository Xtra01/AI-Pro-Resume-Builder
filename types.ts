export enum SectionType {
  EXPERIENCE = 'EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILLS = 'SKILLS',
  PROJECTS = 'PROJECTS',
  LANGUAGES = 'LANGUAGES',
  CUSTOM = 'CUSTOM'
}

export interface CVItem {
  id: string;
  title: string; // Job title, School name, Skill name
  subtitle?: string; // Company, Degree
  date?: string;
  description?: string; // Bullets or text
  location?: string;
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  items: CVItem[];
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  sections: CVSection[];
  themeColor: string;
  template: 'modern' | 'classic' | 'minimal';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}