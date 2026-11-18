export interface IngestChunkRequest {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
}

export interface IngestChunkResponse {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  dimension: number;
  createdAt: string;
}

export interface SimilaritySearchRequest {
  query: string;
  topK?: number;
  minScore?: number;
}

export interface SimilarChunk {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  similarityScore: number;
}

export interface RagQueryRequest {
  question: string;
  topK?: number;
  minScore?: number;
}

export interface Citation {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  excerpt: string;
  similarityScore: number;
}

export interface RagQueryResponse {
  question: string;
  answer: string;
  confidenceScore: number;
  retrievedChunksCount: number;
  citations: Citation[];
  processedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  confidenceScore?: number;
  loading?: boolean;
}
