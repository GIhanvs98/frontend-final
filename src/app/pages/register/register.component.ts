import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h2>Create Account</h2>
          <p>Join the AI Knowledge Assistant ecosystem</p>
        </div>

        @if (errorMessage()) {
          <div class="alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              [(ngModel)]="username"
              placeholder="Username"
              required
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              [(ngModel)]="email"
              placeholder="name@company.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              [(ngModel)]="password"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" name="role" [(ngModel)]="role">
              <option value="ROLE_USER">Regular User (ROLE_USER)</option>
              <option value="ROLE_ADMIN">Administrator (ROLE_ADMIN)</option>
            </select>
          </div>

          <button type="submit" [disabled]="loading() || !username || !email || !password" class="btn-submit">
            @if (loading()) {
              <span class="spinner"></span>
              <span>Creating account...</span>
            } @else {
              <span>Create Account</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page-wrapper {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: radial-gradient(circle at top, rgba(30, 41, 59, 0.7) 0%, rgba(11, 19, 41, 1) 100%);
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(16px);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-box {
      width: 52px;
      height: 52px;
      margin: 0 auto 1rem;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
    }
    .auth-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.5rem;
    }
    .auth-header p {
      font-size: 0.88rem;
      color: #94a3b8;
      margin: 0;
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.85rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #cbd5e1;
    }
    .form-group input, .form-group select {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 0.7rem 0.9rem;
      color: #f8fafc;
      font-size: 0.92rem;
      outline: none;
      transition: all 0.2s ease;
    }
    .form-group input:focus, .form-group select:focus {
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }
    .form-group select option {
      background: #0f172a;
      color: #f8fafc;
    }
    .btn-submit {
      margin-top: 0.5rem;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.8rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    .btn-submit:hover:not(:disabled) {
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
      transform: translateY(-1px);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .auth-footer {
      text-align: center;
      margin-top: 1.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .auth-footer a {
      color: #34d399;
      text-decoration: none;
      font-weight: 600;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public username = '';
  public email = '';
  public password = '';
  public role = 'ROLE_USER';

  public readonly loading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public onSubmit(): void {
    if (!this.username || !this.email || !this.password) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Registration failed. Please check form inputs.');
      }
    });
  }
}
