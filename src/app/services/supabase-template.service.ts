import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { ResumeData } from '../resume-templates/models/resume-data.interface';

export interface TemplateMetadata {
  id?: number;
  template_id: number;
  name: string;
  category: string;
  thumbnail_url?: string;
  is_active?: boolean;
}

export interface UserResume {
  id?: string;
  user_id?: string;
  template_id: number;
  resume_name: string;
  resume_data: ResumeData;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseTemplateService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Get all available templates
  async getAllTemplates(): Promise<TemplateMetadata[]> {
    const { data, error } = await this.supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('template_id');

    if (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
    return data || [];
  }

  // Get templates by category
  async getTemplatesByCategory(category: string): Promise<TemplateMetadata[]> {
    const { data, error } = await this.supabase
      .from('templates')
      .select('*')
      .eq('category', category)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching templates by category:', error);
      return [];
    }
    return data || [];
  }

  // Save user resume with template selection
  async saveUserResume(resume: UserResume): Promise<{ success: boolean; id?: string; error?: any }> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const resumeData = {
      user_id: user.data.user.id,
      template_id: resume.template_id,
      resume_name: resume.resume_name,
      resume_data: resume.resume_data,
      status: resume.status || 'draft',
      updated_at: new Date().toISOString()
    };

    if (resume.id) {
      // Update existing resume
      const { data, error } = await this.supabase
        .from('user_resumes')
        .update(resumeData)
        .eq('id', resume.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating resume:', error);
        return { success: false, error };
      }
      return { success: true, id: data.id };
    } else {
      // Insert new resume
      const { data, error } = await this.supabase
        .from('user_resumes')
        .insert(resumeData)
        .select()
        .single();

      if (error) {
        console.error('Error saving resume:', error);
        return { success: false, error };
      }
      return { success: true, id: data.id };
    }
  }

  // Get user's resumes
  async getUserResumes(): Promise<UserResume[]> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return [];

    const { data, error } = await this.supabase
      .from('user_resumes')
      .select('*')
      .eq('user_id', user.data.user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching user resumes:', error);
      return [];
    }
    return data || [];
  }

  // Get specific resume by ID
  async getResumeById(id: string): Promise<UserResume | null> {
    const { data, error } = await this.supabase
      .from('user_resumes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching resume:', error);
      return null;
    }
    return data;
  }

  // Delete resume
  async deleteResume(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('user_resumes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resume:', error);
      return false;
    }
    return true;
  }
}
