import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'access_token';
  private readonly apiUrl = '/api/auth';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): { id: number; email: string } | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }

    try {
      const decoded = JSON.parse(atob(payload)) as {
        sub?: number | string;
        email?: string;
      };
      if (!decoded.email || decoded.sub === undefined) {
        return null;
      }
      return { id: Number(decoded.sub), email: decoded.email };
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  login(payload: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, payload)
      .pipe(tap((res) => this.setToken(res.accessToken)));
  }

  startGoogleLogin(returnUrl?: string) {
    const params = new URLSearchParams();
    if (returnUrl) {
      params.set('state', returnUrl);
    }
    window.location.href = `${this.apiUrl}/google${
      params.toString() ? `?${params.toString()}` : ''
    }`;
  }

  completeOAuthLogin(token: string, returnUrl?: string) {
    this.setToken(token);
    this.router.navigate([returnUrl || '/users']);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
