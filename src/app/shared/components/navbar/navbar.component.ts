import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="navbar-header">
      <div class="navbar-brand">
        <a routerLink="/dashboard" class="brand-link">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">KnowledgeAI</span>
            <span class="brand-badge">Enterprise RAG</span>
          </div>
        </a>
      </div>

      <div class="navbar-actions">
        <div class="system-status">
          <span class="status-dot"></span>
          <span class="status-label">Gateway: 8080 Connected</span>
        </div>

        @if (authService.isAuthenticated()) {
          <div class="user-pill">
            <div class="avatar-circle">
              {{ authService.username().charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <span class="username">{{ authService.username() }}</span>
              <span class="role-tag">{{ authService.role() }}</span>
            </div>
          </div>
          <button (click)="logout()" class="btn-logout" title="Sign Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        } @else {
          <a routerLink="/login" class="btn-login">Sign In</a>
        }
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      height: 64px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #fff;
    }
    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(90deg, #ffffff, #93c5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .brand-badge {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      font-weight: 600;
    }
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .system-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.3rem 0.75rem 0.3rem 0.4rem;
      border-radius: 9999px;
    }
    .avatar-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .user-details {
      display: flex;
      flex-direction: column;
    }
    .username {
      font-size: 0.82rem;
      font-weight: 600;
      color: #f1f5f9;
      line-height: 1.1;
    }
    .role-tag {
      font-size: 0.65rem;
      color: #60a5fa;
      font-weight: 500;
    }
    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.5);
    }
    .btn-login {
      background: #3b82f6;
      color: #fff;
      text-decoration: none;
      padding: 0.5rem 1.1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: background 0.2s ease;
    }
    .btn-login:hover {
      background: #2563eb;
    }
  `]
})
export class NavbarComponent {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
