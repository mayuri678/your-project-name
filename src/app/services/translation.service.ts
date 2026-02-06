import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguage.asObservable();

  private translations: any = {
    en: {
      'username': 'Username',
      'email': 'Email',
      'contactNo': 'Contact Number',
      'address': 'Address',
      'city': 'City',
      'state': 'State',
      'country': 'Country',
      'save': 'Save',
      'edit': 'Edit',
      'cancel': 'Cancel'
    },
    mr: {
      'username': 'वापरकर्ता नाव',
      'email': 'ईमेल',
      'contactNo': 'संपर्क क्रमांक',
      'address': 'पत्ता',
      'city': 'शहर',
      'state': 'राज्य',
      'country': 'देश',
      'save': 'जतन करा',
      'edit': 'संपादित करा',
      'cancel': 'रद्द करा'
    },
    hi: {
      'username': 'उपयोगकर्ता नाम',
      'email': 'ईमेल',
      'contactNo': 'संपर्क नंबर',
      'address': 'पता',
      'city': 'शहर',
      'state': 'राज्य',
      'country': 'देश',
      'save': 'सेव करें',
      'edit': 'एडिट करें',
      'cancel': 'कैंसल करें'
    }
  };

  setLanguage(lang: string) {
    this.currentLanguage.next(lang);
  }

  translate(key: string): string {
    const lang = this.currentLanguage.value;
    return this.translations[lang]?.[key] || key;
  }

  translateResume(resumeText: string, targetLanguage: string): string {
    const translationMap = this.translations[targetLanguage] || {};
    let translatedText = resumeText;
    
    Object.entries(translationMap).forEach(([english, translated]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translated as string);
    });
    
    return translatedText;
  }
}