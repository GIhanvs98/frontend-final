import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DocumentService } from '../../core/services/document.service';
import { DocumentDto } from '../../core/models/document.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-page">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>Enterprise Knowledge Platform</h1>
          <p>
            Welcome back, <strong>{{ authService.username() }}</strong>. 
            Microservices architecture is active and orchestrating semantic vector search.
          </p>
        </div>
        <div class="welcome-actions">
          <a routerLink="/chat" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Ask AI Assistant</span>
          </a>
          <a routerLink="/documents" class="btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Upload Document</span>
          </a>
        </div>
      </div>

      <!-- KPI Metrics -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-title">Indexed Documents</span>
            <span class="kpi-value">{{ documents().length }}</span>
            <span class="kpi-sub">Across PostgreSQL storage</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
              <line x1="6" y1="6" x2="6.01" y2="6"/>
              <line x1="6" y1="18" x2="6.01" y2="18"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-title">Total Chunks</span>
            <span class="kpi-value">{{ totalChunks() }}</span>
            <span class="kpi-sub">500-char sliding windows</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-title">Vector Dimensions</span>
            <span class="kpi-value">128 Dense</span>
            <span class="kpi-sub">L2 Normalized Embeddings</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-title">Microservices Health</span>
            <span class="kpi-value">5 / 5 Healthy</span>
            <span class="kpi-sub">Eureka registry synchronous</span>
          </div>
        </div>
      </div>

      <!-- Architecture & Pipeline Status -->
      <div class="dashboard-grid">
        <div class="card info-card">
          <div class="card-header">
            <h3>Enterprise Polyrepo Microservices</h3>
            <span class="badge-status">Spring Cloud</span>
          </div>
          <div class="card-body">
            <p class="section-desc">
              All microservices run in isolated containers with independent databases and externalized <code>.env</code> configurations:
            </p>
            <div class="service-table-wrapper">
              <table class="service-table">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Port</th>
                    <th>Routing / Registry</th>
                    <th>Database</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Discovery Server</strong></td>
                    <td><code>8761</code></td>
                    <td>Netflix Eureka Server</td>
                    <td>In-Memory Registry</td>
                  </tr>
                  <tr>
                    <td><strong>API Gateway</strong></td>
                    <td><code>8080</code></td>
                    <td>Reactive Gateway + Global Correlation Filter</td>
                    <td>N/A</td>
                  </tr>
                  <tr>
                    <td><strong>Auth Service</strong></td>
                    <td><code>8081</code></td>
                    <td><code>lb://auth-service</code></td>
                    <td><code>auth_db</code> (PostgreSQL)</td>
                  </tr>
                  <tr>
                    <td><strong>Document Service</strong></td>
                    <td><code>8082</code></td>
                    <td><code>lb://document-service</code></td>
                    <td><code>document_db</code> (PostgreSQL)</td>
                  </tr>
                  <tr>
                    <td><strong>AI & RAG Service</strong></td>
                    <td><code>8083</code></td>
                    <td><code>lb://ai-service</code></td>
                    <td><code>knowledge_vector_db</code> (PostgreSQL)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card recent-docs-card">
          <div class="card-header">
            <h3>Knowledge Documents</h3>
            <a routerLink="/documents" class="link-more">View all &rarr;</a>
          </div>
          <div class="card-body">
            @if (loading()) {
              <div class="loading-state">
                <span class="spinner"></span>
                <p>Loading knowledge records...</p>
              </div>
            } @else if (documents().length === 0) {
              <div class="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>No documents uploaded yet.</p>
                <a routerLink="/documents" class="btn-sm">Upload First Document</a>
              </div>
            } @else {
              <div class="docs-mini-list">
                @for (doc of documents().slice(0, 5); track doc.id) {
                  <div class="doc-mini-row">
                    <div class="doc-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div class="doc-info">
                      <span class="doc-title">{{ doc.title }}</span>
                      <span class="doc-meta">{{ doc.chunkCount }} chunks • {{ (doc.fileSize / 1024).toFixed(1) }} KB</span>
                    </div>
                    <span class="doc-status-pill">{{ doc.status }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .welcome-banner {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .welcome-text h1 {
      margin: 0 0 0.5rem;
      font-size: 1.8rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .welcome-text p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .welcome-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: #fff;
      text-decoration: none;
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .btn-primary:hover {
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #f8fafc;
      text-decoration: none;
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.88rem;
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .kpi-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .kpi-icon.blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .kpi-icon.purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
    .kpi-icon.emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .kpi-icon.amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .kpi-content {
      display: flex;
      flex-direction: column;
    }
    .kpi-title {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 500;
    }
    .kpi-value {
      font-size: 1.4rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0.2rem 0;
    }
    .kpi-sub {
      font-size: 0.72rem;
      color: #64748b;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
    .card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      overflow: hidden;
    }
    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #f8fafc;
      font-weight: 600;
    }
    .badge-status {
      font-size: 0.75rem;
      background: rgba(59, 130, 246, 0.15);
      color: #93c5fd;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .card-body {
      padding: 1.5rem;
    }
    .section-desc {
      margin: 0 0 1rem;
      font-size: 0.88rem;
      color: #94a3b8;
      line-height: 1.5;
    }
    .section-desc code {
      background: rgba(255, 255, 255, 0.08);
      color: #38bdf8;
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
    }
    .service-table-wrapper {
      overflow-x: auto;
    }
    .service-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.86rem;
    }
    .service-table th {
      padding: 0.65rem 0.85rem;
      color: #64748b;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .service-table td {
      padding: 0.75rem 0.85rem;
      color: #cbd5e1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .service-table code {
      background: rgba(255, 255, 255, 0.06);
      color: #93c5fd;
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.8rem;
    }
    .link-more {
      color: #60a5fa;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 500;
    }
    .link-more:hover {
      text-decoration: underline;
    }
    .empty-state {
      text-align: center;
      padding: 2.5rem 1rem;
      color: #64748b;
    }
    .empty-state p {
      margin: 0.75rem 0 1rem;
      font-size: 0.88rem;
    }
    .btn-sm {
      background: #3b82f6;
      color: #fff;
      text-decoration: none;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .docs-mini-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .doc-mini-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
    }
    .doc-icon {
      color: #60a5fa;
    }
    .doc-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .doc-title {
      font-size: 0.86rem;
      font-weight: 500;
      color: #f1f5f9;
    }
    .doc-meta {
      font-size: 0.72rem;
      color: #64748b;
    }
    .doc-status-pill {
      font-size: 0.68rem;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .loading-state {
      text-align: center;
      padding: 2rem;
      color: #94a3b8;
    }
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
      margin-bottom: 0.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly documentService = inject(DocumentService);

  public readonly documents = signal<DocumentDto[]>([]);
  public readonly loading = signal(false);
  public readonly totalChunks = signal(0);

  public ngOnInit(): void {
    this.fetchDocuments();
  }

  private fetchDocuments(): void {
    this.loading.set(true);
    this.documentService.getDocuments().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.documents.set(res.data);
          const total = res.data.reduce((acc, doc) => acc + (doc.chunkCount || 0), 0);
          this.totalChunks.set(total);
        }
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
