import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthError, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async login(email: string, password: string): Promise<{ data: { session: Session | null }; error: AuthError | null }> {
    const result = await this.supabase.auth.signInWithPassword({ email, password });
    if (result.data && result.data.session) {
      try {
        const nameFromEmail = email.includes('@') ? email.split('@')[0] : email;
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUserEmail', email);
        localStorage.setItem('currentUserName', nameFromEmail);
        
        // Add user to logged-in users list
        this.authService.addLoggedInUser(email, nameFromEmail);
      } catch {}
    }
    return result;
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }
}
