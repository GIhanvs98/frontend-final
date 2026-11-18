import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { AiService } from '../../core/services/ai.service';
import { DocumentChunkDto, DocumentDto } from '../../core/models/document.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [FormsModule, SlicePipe],
  template: `
    <div class="documents-page">
      <div class="page-header">
        <div>
          <h2>Document Repository & Vector Ingestion</h2>
          <p>Upload enterprise documentation, verify sliding-window text chunking, and sync to the AI vector store.</p>
        </div>
      </div>

      <!-- Upload Section -->
      <div class="upload-card">
        <h3>Upload Knowledge Source</h3>
        <form (ngSubmit)="onUpload()" class="upload-form">
          <div class="form-row">
            <div class="form-group flex-1">
              <label for="docTitle">Document Title</label>
              <input
                id="docTitle"
                type="text"
                name="title"
                [(ngModel)]="uploadTitle"
                placeholder="e.g. Microservices Architecture Guide"
                required
              />
            </div>

            <div class="form-group flex-1">
              <label for="docFile">File (.txt, .md, .pdf, .json, .csv)</label>
              <input
                id="docFile"
                type="file"
                (change)="onFileSelected($event)"
                required
              />
            </div>

            <div class="form-actions">
              <button
                type="submit"
                [disabled]="uploading() || !selectedFile || !uploadTitle"
                class="btn-upload"
              >
                @if (uploading()) {
                  <span class="spinner"></span>
                  <span>Processing...</span>
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Upload & Chunk</span>
                }
              </button>
            </div>
          </div>
        </form>

        @if (uploadMessage()) {
          <div [class]="uploadSuccess() ? 'alert-success' : 'alert-error'">
            {{ uploadMessage() }}
          </div>
        }
      </div>

      <!-- Documents List Section -->
      <div class="list-card">
        <div class="list-header">
          <h3>Ingested Knowledge Documents ({{ documents().length }})</h3>
          <button (click)="loadDocuments()" class="btn-refresh" title="Reload Documents">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        @if (loading()) {
          <div class="loading-state">
            <span class="spinner"></span>
            <p>Loading document records...</p>
          </div>
        } @else if (documents().length === 0) {
          <div class="empty-state">
            <p>No documents found. Upload your first knowledge source above.</p>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>File Name</th>
                  <th>File Size</th>
                  <th>Chunks</th>
                  <th>Status</th>
                  <th>Uploaded At</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (doc of documents(); track doc.id) {
                  <tr>
                    <td class="font-semibold">{{ doc.title }}</td>
                    <td class="text-muted">{{ doc.fileName }}</td>
                    <td>{{ (doc.fileSize / 1024).toFixed(1) }} KB</td>
                    <td>
                      <span class="chunk-badge">{{ doc.chunkCount }} chunks</span>
                    </td>
                    <td>
                      <span [class]="'status-pill ' + doc.status.toLowerCase()">
                        {{ doc.status }}
                      </span>
                    </td>
                    <td class="text-muted">{{ doc.createdAt | slice:0:16 }}</td>
                    <td class="text-right actions-cell">
                      <button (click)="viewChunks(doc)" class="btn-action view" title="View Document Chunks">
                        Inspect Chunks
                      </button>
                      <button (click)="syncToVectorStore(doc)" [disabled]="syncing() === doc.id" class="btn-action sync" title="Generate Embeddings in AI Service">
                        @if (syncing() === doc.id) {
                          Syncing...
                        } @else {
                          Sync AI Vector
                        }
                      </button>
                      <button (click)="download(doc)" class="btn-action download" title="Download Original">
                        Download
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Chunks Inspection Modal -->
      @if (selectedDocForChunks()) {
        <div class="modal-backdrop" (click)="closeChunksModal()">
          <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <h3>Chunks for: {{ selectedDocForChunks()?.title }}</h3>
                <span class="sub-text">500 characters window • 50 characters overlap</span>
              </div>
              <button (click)="closeChunksModal()" class="btn-close">&times;</button>
            </div>

            <div class="modal-body">
              @if (loadingChunks()) {
                <div class="loading-state">
                  <span class="spinner"></span>
                  <p>Fetching chunks from Document Service...</p>
                </div>
              } @else if (chunks().length === 0) {
                <p class="empty-state">No chunks available for this document.</p>
              } @else {
                <div class="chunks-list">
                  @for (chunk of chunks(); track chunk.id) {
                    <div class="chunk-card">
                      <div class="chunk-header">
                        <span class="chunk-num">Chunk #{{ chunk.chunkIndex + 1 }}</span>
                        <span class="token-count">Tokens: ~{{ chunk.tokenCount }}</span>
                      </div>
                      <div class="chunk-content">
                        {{ chunk.content }}
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="modal-footer">
              <button (click)="closeChunksModal()" class="btn-secondary">Close</button>
              <button (click)="syncToVectorStore(selectedDocForChunks()!)" [disabled]="syncing() === selectedDocForChunks()?.id" class="btn-primary">
                {{ syncing() === selectedDocForChunks()?.id ? 'Syncing...' : 'Sync All Chunks to AI Service' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .documents-page {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .page-header h2 {
      margin: 0 0 0.25rem;
      color: #f8fafc;
      font-size: 1.5rem;
      font-weight: 700;
    }
    .page-header p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.9rem;
    }
    .upload-card, .list-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1.5rem;
    }
    .upload-card h3, .list-card h3 {
      margin: 0 0 1.25rem;
      color: #f8fafc;
      font-size: 1.15rem;
      font-weight: 600;
    }
    .upload-form .form-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .flex-1 { flex: 1; min-width: 260px; }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group label {
      font-size: 0.82rem;
      font-weight: 500;
      color: #cbd5e1;
    }
    .form-group input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      color: #f8fafc;
      font-size: 0.88rem;
      outline: none;
    }
    .form-group input:focus {
      border-color: #3b82f6;
    }
    .form-actions {
      display: flex;
      align-items: flex-end;
    }
    .btn-upload {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.7rem 1.25rem;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 40px;
    }
    .btn-upload:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .alert-success {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      border-radius: 8px;
      font-size: 0.85rem;
    }
    .alert-error {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      border-radius: 8px;
      font-size: 0.85rem;
    }
    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .btn-refresh {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .docs-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.86rem;
    }
    .docs-table th {
      padding: 0.75rem 0.85rem;
      color: #64748b;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .docs-table td {
      padding: 0.85rem;
      color: #cbd5e1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .font-semibold { font-weight: 600; color: #f8fafc; }
    .text-muted { color: #64748b; font-size: 0.8rem; }
    .text-right { text-align: right; }
    .chunk-badge {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-pill {
      font-size: 0.72rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .status-pill.processed {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    .status-pill.pending {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }
    .actions-cell {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    .btn-action {
      border: none;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-size: 0.76rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-action.view {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }
    .btn-action.sync {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    .btn-action.download {
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
    }
    .btn-action:hover:not(:disabled) {
      filter: brightness(1.2);
    }
    .btn-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    /* Modal styles */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1.5rem;
    }
    .modal-dialog {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      width: 100%;
      max-width: 800px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .modal-header h3 {
      margin: 0 0 0.2rem;
      color: #f8fafc;
      font-size: 1.2rem;
    }
    .sub-text {
      font-size: 0.78rem;
      color: #64748b;
    }
    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      color: #94a3b8;
      cursor: pointer;
    }
    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }
    .chunks-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .chunk-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 1rem;
    }
    .chunk-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.6rem;
      font-size: 0.78rem;
    }
    .chunk-num {
      color: #60a5fa;
      font-weight: 600;
    }
    .token-count {
      color: #64748b;
    }
    .chunk-content {
      font-family: monospace;
      font-size: 0.82rem;
      color: #cbd5e1;
      line-height: 1.5;
      white-space: pre-wrap;
      background: rgba(0, 0, 0, 0.25);
      padding: 0.75rem;
      border-radius: 6px;
    }
    .modal-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .btn-primary {
      background: #3b82f6;
      color: #fff;
      border: none;
      padding: 0.55rem 1.1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.55rem 1.1rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class DocumentsComponent implements OnInit {
  private readonly documentService = inject(DocumentService);
  private readonly aiService = inject(AiService);

  public readonly documents = signal<DocumentDto[]>([]);
  public readonly loading = signal(false);
  public readonly uploading = signal(false);
  public readonly syncing = signal<string | null>(null);

  public uploadTitle = '';
  public selectedFile: File | null = null;
  public uploadMessage = signal<string | null>(null);
  public uploadSuccess = signal(true);

  // Modal State
  public selectedDocForChunks = signal<DocumentDto | null>(null);
  public chunks = signal<DocumentChunkDto[]>([]);
  public loadingChunks = signal(false);

  public ngOnInit(): void {
    this.loadDocuments();
  }

  public loadDocuments(): void {
    this.loading.set(true);
    this.documentService.getDocuments().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.documents.set(res.data);
        }
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (!this.uploadTitle) {
        // Auto-fill title from file name without extension
        this.uploadTitle = this.selectedFile.name.replace(/\.[^/.]+$/, '');
      }
    }
  }

  public onUpload(): void {
    if (!this.selectedFile || !this.uploadTitle) return;

    this.uploading.set(true);
    this.uploadMessage.set(null);

    this.documentService.uploadDocument(this.selectedFile, this.uploadTitle).subscribe({
      next: (res) => {
        this.uploading.set(false);
        this.uploadSuccess.set(true);
        this.uploadMessage.set(`Document '${res.data.title}' uploaded successfully! Created ${res.data.chunkCount} chunks.`);
        this.uploadTitle = '';
        this.selectedFile = null;
        this.loadDocuments();
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadSuccess.set(false);
        this.uploadMessage.set(err.error?.message || 'Document upload failed.');
      }
    });
  }

  public viewChunks(doc: DocumentDto): void {
    this.selectedDocForChunks.set(doc);
    this.loadingChunks.set(true);
    this.documentService.getDocumentChunks(doc.id).subscribe({
      next: (res) => {
        this.loadingChunks.set(false);
        if (res.success && res.data) {
          this.chunks.set(res.data);
        }
      },
      error: () => {
        this.loadingChunks.set(false);
      }
    });
  }

  public closeChunksModal(): void {
    this.selectedDocForChunks.set(null);
    this.chunks.set([]);
  }

  public syncToVectorStore(doc: DocumentDto): void {
    this.syncing.set(doc.id);

    // Fetch chunks and ingest them into AI vector store
    this.documentService.getDocumentChunks(doc.id).subscribe({
      next: (res) => {
        if (!res.data || res.data.length === 0) {
          this.syncing.set(null);
          return;
        }

        let completed = 0;
        const total = res.data.length;

        res.data.forEach(chunk => {
          this.aiService.ingestChunk({
            chunkId: chunk.id,
            documentId: doc.id,
            documentTitle: doc.title,
            chunkIndex: chunk.chunkIndex,
            content: chunk.content
          }).subscribe({
            next: () => {
              completed++;
              if (completed === total) {
                this.syncing.set(null);
                this.uploadSuccess.set(true);
                this.uploadMessage.set(`Successfully synced all ${total} chunks for '${doc.title}' to AI Vector Store!`);
              }
            },
            error: () => {
              completed++;
              if (completed === total) {
                this.syncing.set(null);
              }
            }
          });
        });
      },
      error: () => {
        this.syncing.set(null);
      }
    });
  }

  public download(doc: DocumentDto): void {
    this.documentService.downloadDocument(doc.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}
