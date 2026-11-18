# Enterprise Knowledge Assistant - Angular Frontend

Modern Angular Single Page Application (SPA) providing an interactive user interface for the **AI-Powered Enterprise Knowledge Assistant** microservices platform.

## Architecture & Integration
- **Framework**: Angular 22 (Standalone Components, Signals, Reactive State Management)
- **Routing & Navigation**: Dynamic lazy-loaded routes with `authGuard` and `guestGuard`
- **HTTP Client**: Functional `HttpInterceptorFn` injecting JWT Bearer tokens and managing 401 unauthenticated redirects
- **API Gateway Integration**: Communicates via `http://localhost:8080`, routing requests to:
  - `auth-service` (Port 8081)
  - `document-service` (Port 8082)
  - `ai-service` (Port 8083)

## Key Features

1. **Authentication & Session Management**:
   - Secure login and registration with validation and role assignment.
   - Signal-based reactive auth session (`currentUser`, `isAuthenticated`).
   - Automated token persistence in local storage and auto-logout on token expiration.

2. **Enterprise Dashboard**:
   - High-level platform KPIs: Indexed Documents, Chunks, Vector Store Dimensions, and Microservice Health.
   - Live Microservices Topology view displaying service status and port mapping.
   - Quick action shortcuts for document uploading and AI assistant queries.

3. **Document Repository & Chunk Inspector**:
   - Multi-format file uploader (`.txt`, `.pdf`, `.md`, `.csv`, `.json`).
   - Document listing with status badges, chunk counts, and file downloads.
   - Modal chunk inspector showing sliding-window text chunks with token estimates.
   - One-click vector synchronization triggering embedding generation in `ai-service`.

4. **Interactive RAG AI Assistant**:
   - Real-time conversational interface querying the Retrieval-Augmented Generation pipeline.
   - Grounded responses synthesized from document chunks.
   - Interactive citations drawer displaying source document title, chunk index, similarity percentage, and snippet excerpt.
   - Configurable retrieval parameters: Top-K chunks and minimum similarity score threshold.

## Project Structure
```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # Route guards for authentication
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts     # JWT injection & 401 handling
│   │   ├── models/
│   │   │   ├── ai.model.ts             # RAG and Vector DTOs
│   │   │   ├── api-response.model.ts   # Generic API response contracts
│   │   │   ├── auth.model.ts           # Auth credentials & user session
│   │   │   └── document.model.ts       # Document metadata & chunks
│   │   └── services/
│   │       ├── ai.service.ts           # AI & RAG HTTP client
│   │       ├── auth.service.ts         # Authentication HTTP client & signals
│   │       └── document.service.ts     # Document upload & chunk retrieval
│   ├── pages/
│   │   ├── chat/                       # RAG Knowledge Assistant chat
│   │   ├── dashboard/                  # Platform overview & metrics
│   │   ├── documents/                  # Document management & chunk sync
│   │   ├── login/                      # User authentication
│   │   └── register/                   # User sign-up
│   ├── shared/
│   │   └── components/
│   │       ├── navbar/                 # Global navigation & status
│   │       └── sidebar/                # Main workspace sidebar & topology
│   ├── app.config.ts                   # Application providers & HTTP setup
│   ├── app.routes.ts                   # Routes definition
│   ├── app.ts                          # Root component
│   └── app.html                        # App layout template
├── environments/
│   ├── environment.ts                  # Production gateway URL
│   └── environment.development.ts      # Development gateway URL
└── styles.css                          # Dark-mode enterprise design tokens
```

## Getting Started

### Prerequisites
- Node.js 20+ / 22+
- npm 10+
- Running API Gateway on `http://localhost:8080`

### Installation
```bash
npm install --legacy-peer-deps
```

### Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`.

### Production Build
```bash
npm run build
```
Compiled static assets will be output in `dist/frontend/`.

### Running Tests
```bash
npm test -- --watch=false
```
