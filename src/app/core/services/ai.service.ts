import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  IngestChunkRequest,
  IngestChunkResponse,
  RagQueryRequest,
  RagQueryResponse,
  SimilarChunk,
  SimilaritySearchRequest
} from '../models/ai.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/v1/ai`;

  public ingestChunk(payload: IngestChunkRequest): Observable<ApiResponse<IngestChunkResponse>> {
    return this.http.post<ApiResponse<IngestChunkResponse>>(`${this.baseUrl}/ingest`, payload);
  }

  public searchSimilar(query: SimilaritySearchRequest): Observable<ApiResponse<SimilarChunk[]>> {
    return this.http.post<ApiResponse<SimilarChunk[]>>(`${this.baseUrl}/search`, query);
  }

  public queryRag(request: RagQueryRequest): Observable<ApiResponse<RagQueryResponse>> {
    return this.http.post<ApiResponse<RagQueryResponse>>(`${this.baseUrl}/query`, request);
  }
}
