import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AiService } from '../../core/services/ai.service';
import { ChatMessage, Citation } from '../../core/models/ai.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="chat-page">
      <!-- Assistant Header -->
      <div class="chat-header">
        <div class="header-main">
          <div class="bot-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
              <rect x="3" y="6" width="18" height="12" rx="4"/>
              <circle cx="9" cy="12" r="1.5"/>
              <circle cx="15" cy="12" r="1.5"/>
              <path d="M9 16c1.5 1 4.5 1 6 0"/>
            </svg>
          </div>
          <div>
            <h2>Enterprise Knowledge Assistant</h2>
            <p>Retrieval-Augmented Generation (RAG) powered by normalized vector embeddings & semantic search</p>
          </div>
        </div>

        <div class="rag-controls">
          <div class="control-item">
            <label>Top-K:</label>
            <select [(ngModel)]="topK">
              <option [value]="3">3 Chunks</option>
              <option [value]="5">5 Chunks</option>
              <option [value]="10">10 Chunks</option>
            </select>
          </div>
          <div class="control-item">
            <label>Min Score:</label>
            <select [(ngModel)]="minScore">
              <option [value]="0.05">0.05 (Broad)</option>
              <option [value]="0.1">0.10 (Balanced)</option>
              <option [value]="0.25">0.25 (Strict)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Quick prompts -->
      <div class="quick-prompts">
        <span class="prompt-label">Try asking:</span>
        <button (click)="usePrompt('What is the architecture and port allocation for our microservices?')" class="prompt-chip">
          Architecture & Ports
        </button>
        <button (click)="usePrompt('How does the Auth Service handle user authentication and JWT validation?')" class="prompt-chip">
          JWT Authentication
        </button>
        <button (click)="usePrompt('Explain how documents are uploaded and chunked before vector embedding.')" class="prompt-chip">
          Document Chunking Flow
        </button>
      </div>

      <!-- Messages Thread -->
      <div class="messages-container">
        @for (msg of messages(); track msg.id) {
          <div [class]="'message-row ' + msg.sender">
            <div class="message-bubble">
              <div class="message-header">
                <span class="sender-name">{{ msg.sender === 'user' ? 'You' : 'Knowledge Assistant' }}</span>
                <span class="message-time">{{ msg.timestamp | date:'shortTime' }}</span>
                @if (msg.confidenceScore !== undefined) {
                  <span class="confidence-badge">
                    Relevance: {{ (msg.confidenceScore * 100).toFixed(1) }}%
                  </span>
                }
              </div>

              @if (msg.loading) {
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              } @else {
                <div class="message-text">
                  {{ msg.content }}
                </div>

                @if (msg.citations && msg.citations.length > 0) {
                  <div class="citations-section">
                    <div class="citations-header">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span>Grounded Knowledge Citations ({{ msg.citations.length }}):</span>
                    </div>

                    <div class="citations-list">
                      @for (citation of msg.citations; track citation.chunkId) {
                        <div class="citation-card">
                          <div class="citation-top">
                            <span class="citation-title">{{ citation.documentTitle }}</span>
                            <span class="citation-badge">Chunk #{{ citation.chunkIndex + 1 }} • {{ (citation.similarityScore * 100).toFixed(1) }}% match</span>
                          </div>
                          <div class="citation-excerpt">
                            "{{ citation.excerpt }}"
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        }
      </div>

      <!-- Input Bar -->
      <div class="chat-input-wrapper">
        <form (ngSubmit)="sendQuery()" class="chat-input-form">
          <input
            type="text"
            [(ngModel)]="currentQuery"
            name="query"
            placeholder="Ask a question about your enterprise knowledge base..."
            [disabled]="loading()"
            autocomplete="off"
          />
          <button type="submit" [disabled]="loading() || !currentQuery.trim()" class="btn-send">
            @if (loading()) {
              <span class="spinner"></span>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .chat-page {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 64px);
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 1.5rem 1rem;
      gap: 1rem;
    }
    .chat-header {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .header-main {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .bot-avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .header-main h2 {
      margin: 0 0 0.2rem;
      font-size: 1.25rem;
      color: #f8fafc;
    }
    .header-main p {
      margin: 0;
      font-size: 0.82rem;
      color: #94a3b8;
    }
    .rag-controls {
      display: flex;
      gap: 1rem;
    }
    .control-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .control-item select {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f8fafc;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-size: 0.78rem;
      outline: none;
    }
    .quick-prompts {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }
    .prompt-label {
      font-size: 0.76rem;
      color: #64748b;
      white-space: nowrap;
    }
    .prompt-chip {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.25);
      color: #93c5fd;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.76rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;
    }
    .prompt-chip:hover {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
    }
    .messages-container {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 1rem 0;
    }
    .message-row {
      display: flex;
      width: 100%;
    }
    .message-row.user {
      justify-content: flex-end;
    }
    .message-row.assistant {
      justify-content: flex-start;
    }
    .message-bubble {
      max-width: 80%;
      border-radius: 14px;
      padding: 1rem 1.25rem;
      line-height: 1.5;
    }
    .message-row.user .message-bubble {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff;
      border-bottom-right-radius: 2px;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    }
    .message-row.assistant .message-bubble {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      border-bottom-left-radius: 2px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
    }
    .message-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.5rem;
      font-size: 0.76rem;
    }
    .sender-name {
      font-weight: 600;
      color: #f1f5f9;
    }
    .message-time {
      color: rgba(255, 255, 255, 0.5);
    }
    .confidence-badge {
      margin-left: auto;
      font-size: 0.7rem;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .message-text {
      font-size: 0.92rem;
      white-space: pre-wrap;
    }
    .citations-section {
      margin-top: 1rem;
      padding-top: 0.85rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .citations-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #93c5fd;
      margin-bottom: 0.5rem;
    }
    .citations-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .citation-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
    }
    .citation-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
    }
    .citation-title {
      font-weight: 600;
      color: #f8fafc;
    }
    .citation-badge {
      color: #60a5fa;
      font-family: monospace;
      font-size: 0.7rem;
    }
    .citation-excerpt {
      font-size: 0.76rem;
      color: #94a3b8;
      font-style: italic;
      line-height: 1.4;
    }
    .typing-indicator span {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border-radius: 50%;
      margin-right: 4px;
      animation: pulse 1s infinite;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.1); }
    }
    .chat-input-wrapper {
      padding-top: 0.5rem;
    }
    .chat-input-form {
      display: flex;
      gap: 0.75rem;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 0.4rem 0.6rem 0.4rem 1.25rem;
    }
    .chat-input-form input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #f8fafc;
      font-size: 0.95rem;
    }
    .btn-send {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: #fff;
      border: none;
      border-radius: 8px;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-send:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    .btn-send:disabled {
      opacity: 0.5;
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
  `]
})
export class ChatComponent {
  private readonly aiService = inject(AiService);

  public currentQuery = '';
  public topK = 5;
  public minScore = 0.1;
  public readonly loading = signal(false);

  public readonly messages = signal<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: 'Hello! I am your AI Enterprise Knowledge Assistant. Ask me anything about your uploaded documents, system architecture, or company policies.',
      timestamp: new Date()
    }
  ]);

  public usePrompt(prompt: string): void {
    this.currentQuery = prompt;
    this.sendQuery();
  }

  public sendQuery(): void {
    const question = this.currentQuery.trim();
    if (!question || this.loading()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      content: question,
      timestamp: new Date()
    };

    // Add placeholder assistant message
    const tempId = 'asst-' + Date.now();
    const loadingMsg: ChatMessage = {
      id: tempId,
      sender: 'assistant',
      content: '',
      timestamp: new Date(),
      loading: true
    };

    this.messages.update(list => [...list, userMsg, loadingMsg]);
    this.currentQuery = '';
    this.loading.set(true);

    this.aiService.queryRag({
      question: question,
      topK: Number(this.topK),
      minScore: Number(this.minScore)
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        const data = res.data;
        this.messages.update(list => list.map(msg => {
          if (msg.id === tempId) {
            return {
              id: tempId,
              sender: 'assistant',
              content: data.answer,
              timestamp: new Date(),
              citations: data.citations,
              confidenceScore: data.confidenceScore,
              loading: false
            };
          }
          return msg;
        }));
      },
      error: (err) => {
        this.loading.set(false);
        this.messages.update(list => list.map(msg => {
          if (msg.id === tempId) {
            return {
              id: tempId,
              sender: 'assistant',
              content: 'Error: Could not retrieve answer from AI Service. ' + (err.error?.message || 'Please check service status.'),
              timestamp: new Date(),
              loading: false
            };
          }
          return msg;
        }));
      }
    });
  }
}
