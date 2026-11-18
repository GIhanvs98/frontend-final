export interface DocumentDto {
  id: string;
  title: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  chunkCount: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChunkDto {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  tokenCount: number;
  createdAt: string;
}

export interface DocumentUploadResponse {
  id: string;
  title: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  chunkCount: number;
  status: string;
  createdAt: string;
}
