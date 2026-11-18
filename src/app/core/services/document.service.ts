import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DocumentChunkDto, DocumentDto, DocumentUploadResponse } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/v1/documents`;

  public uploadDocument(file: File, title: string): Observable<ApiResponse<DocumentUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    return this.http.post<ApiResponse<DocumentUploadResponse>>(`${this.baseUrl}/upload`, formData);
  }

  public getDocuments(): Observable<ApiResponse<DocumentDto[]>> {
    return this.http.get<ApiResponse<DocumentDto[]>>(this.baseUrl);
  }

  public getDocumentById(id: string): Observable<ApiResponse<DocumentDto>> {
    return this.http.get<ApiResponse<DocumentDto>>(`${this.baseUrl}/${id}`);
  }

  public getDocumentChunks(id: string): Observable<ApiResponse<DocumentChunkDto[]>> {
    return this.http.get<ApiResponse<DocumentChunkDto[]>>(`${this.baseUrl}/${id}/chunks`);
  }

  public downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob'
    });
  }
}
