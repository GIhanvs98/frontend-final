import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar-container">
      <div class="nav-section">
        <span class="section-label">Core Workspace</span>
        <nav class="nav-list">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Dashboard</span>
          </a>

          <a routerLink="/chat" routerLinkActive="active" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>RAG Assistant</span>
            <span class="chip-live">AI</span>
          </a>

          <a routerLink="/documents" routerLinkActive="active" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span>Documents & Chunks</span>
          </a>
        </nav>
      </div>

      <div class="nav-section services-section">
        <span class="section-label">Microservices Topology</span>
        <div class="service-node">
          <span class="dot green"></span>
          <span class="svc-name">Eureka Discovery</span>
          <span class="svc-port">8761</span>
        </div>
        <div class="service-node">
          <span class="dot green"></span>
          <span class="svc-name">API Gateway</span>
          <span class="svc-port">8080</span>
        </div>
        <div class="service-node">
          <span class="dot green"></span>
          <span class="svc-name">Auth Service</span>
          <span class="svc-port">8081</span>
        </div>
        <div class="service-node">
          <span class="dot green"></span>
          <span class="svc-name">Document Service</span>
          <span class="svc-port">8082</span>
        </div>
        <div class="service-node">
          <span class="dot green"></span>
          <span class="svc-name">AI Service</span>
          <span class="svc-port">8083</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      width: 260px;
      background: #0b1329;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem 1rem;
      min-height: calc(100vh - 64px);
    }
    .section-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      font-weight: 700;
      padding: 0 0.75rem;
      display: block;
      margin-bottom: 0.75rem;
    }
    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.7rem 0.85rem;
      border-radius: 10px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.15s ease;
      position: relative;
    }
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: #f8fafc;
    }
    .nav-item.active {
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.05));
      color: #60a5fa;
      border-left: 3px solid #3b82f6;
      font-weight: 600;
    }
    .chip-live {
      margin-left: auto;
      font-size: 0.65rem;
      background: rgba(139, 92, 246, 0.2);
      color: #a78bfa;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-weight: 700;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .services-section {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1rem 0.85rem;
      margin-top: 2rem;
    }
    .service-node {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.78rem;
      padding: 0.35rem 0;
      color: #cbd5e1;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .dot.green {
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
    }
    .svc-name {
      flex: 1;
    }
    .svc-port {
      font-family: monospace;
      font-size: 0.72rem;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.06);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
    }
  `]
})
export class SidebarComponent {}
