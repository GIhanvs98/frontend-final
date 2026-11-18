import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponseData, LoginRequest, RegisterRequest, UserSession } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/v1/auth`;
  private readonly storageKey = 'knowledge_auth_session';

  private readonly sessionSignal = signal<UserSession | null>(this.loadStoredSession());

  public readonly currentUser = this.sessionSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.sessionSignal());
  public readonly username = computed(() => this.sessionSignal()?.username ?? '');
  public readonly role = computed(() => this.sessionSignal()?.role ?? '');

  public login(credentials: LoginRequest): Observable<ApiResponse<AuthResponseData>> {
    return this.http.post<ApiResponse<AuthResponseData>>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession({
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
              role: response.data.role,
              token: response.data.token
            });
          }
        })
      );
  }

  public register(payload: RegisterRequest): Observable<ApiResponse<AuthResponseData>> {
    return this.http.post<ApiResponse<AuthResponseData>>(`${this.baseUrl}/register`, payload)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession({
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
              role: response.data.role,
              token: response.data.token
            });
          }
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(this.storageKey);
    this.sessionSignal.set(null);
  }

  public getToken(): string | null {
    return this.sessionSignal()?.token ?? null;
  }

  private setSession(session: UserSession): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionSignal.set(session);
  }

  private loadStoredSession(): UserSession | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as UserSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
