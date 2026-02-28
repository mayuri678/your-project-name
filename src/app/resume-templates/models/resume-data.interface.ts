export interface ResumeData {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: { company: string; role: string; duration: string; description: string }[];
  education: { institution: string; degree: string; year: string }[];
  projects: { name: string; description: string }[];
  certifications: string[];
  photo?: string;
}
