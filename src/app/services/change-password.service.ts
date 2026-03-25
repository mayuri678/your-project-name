import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private apiUrl = 'http://localhost:3000/api/auth/change-password';

  constructor(private http: HttpClient) {}

  changePassword(currentPassword: string, newPassword: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, {
      currentPassword,
      newPassword,
      confirmPassword: newPassword
    }, { headers });
  }
}
