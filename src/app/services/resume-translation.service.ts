import { Injectable } from '@angular/core';

export interface ResumeSection {
  title: string;
  content: string;
}

export interface TranslatedResume {
  personalDetails: ResumeSection;
  objective: ResumeSection;
  workExperience: ResumeSection;
  education: ResumeSection;
  skills: ResumeSection;
  projects: ResumeSection;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeTranslationService {
  
  translateResume(resumeText: string, targetLanguage: string): string {
    // This is a simplified implementation
    // In a real application, you would integrate with a translation API
    const translationMap = this.getTranslationMap(targetLanguage);
    
    let translatedText = resumeText;
    
    // Replace common resume terms
    Object.entries(translationMap).forEach(([english, translated]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translated);
    });
    
    return translatedText;
  }
  
  private getTranslationMap(targetLanguage: string): Record<string, string> {
    const translations: Record<string, Record<string, string>> = {
      'spanish': {
        'Personal Details': 'Datos Personales',
        'Objective': 'Objetivo',
        'Work Experience': 'Experiencia Laboral',
        'Education': 'Educación',
        'Skills': 'Habilidades',
        'Projects': 'Proyectos',
        'Name': 'Nombre',
        'Email': 'Correo Electrónico',
        'Phone': 'Teléfono',
        'Address': 'Dirección'
      },
      'french': {
        'Personal Details': 'Informations Personnelles',
        'Objective': 'Objectif',
        'Work Experience': 'Expérience Professionnelle',
        'Education': 'Formation',
        'Skills': 'Compétences',
        'Projects': 'Projets',
        'Name': 'Nom',
        'Email': 'E-mail',
        'Phone': 'Téléphone',
        'Address': 'Adresse'
      }
    };
    
    return translations[targetLanguage.toLowerCase()] || {};
  }
}