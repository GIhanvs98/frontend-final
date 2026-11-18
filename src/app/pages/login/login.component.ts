import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your Enterprise Knowledge Assistant</p>
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
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              [(ngModel)]="email"
              placeholder="Enter your email"
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
              autocomplete="current-password"
            />
          </div>

          <button type="submit" [disabled]="loading() || !email || !password" class="btn-submit">
            @if (loading()) {
              <span class="spinner"></span>
              <span>Authenticating...</span>
            } @else {
              <span>Sign In</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
          <div class="hint-box">
            <span>Tip: Default test credentials: <code>admin</code> / <code>Admin123!</code></span>
          </div>
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
      max-width: 420px;
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
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
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
    .form-group input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 0.7rem 0.9rem;
      color: #f8fafc;
      font-size: 0.92rem;
      outline: none;
      transition: all 0.2s ease;
    }
    .form-group input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }
    .btn-submit {
      margin-top: 0.5rem;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
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
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
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
      color: #60a5fa;
      text-decoration: none;
      font-weight: 600;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
    .hint-box {
      margin-top: 0.75rem;
      font-size: 0.76rem;
      color: #64748b;
    }
    .hint-box code {
      background: rgba(255, 255, 255, 0.08);
      color: #93c5fd;
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      font-family: monospace;
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public email = '';
  public password = '';
  public readonly loading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Authentication failed. Please check credentials.');
      }
    });
  }
}
