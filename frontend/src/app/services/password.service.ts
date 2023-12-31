// password.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private apiUrl = 'http://localhost:5000/api/users'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  forgotPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgot-password`;
    return this.http.post(url, { email });
  }

  resetPassword(data: { email: string; resetPasswordToken: string; password: string }): Observable<any> {
    const resetPasswordUrl = `${this.apiUrl}/reset-password`;
    return this.http.post(resetPasswordUrl, data);
  }
}

