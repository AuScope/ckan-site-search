import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SearchParams, SearchResponse } from '../models/search';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  search(params: SearchParams): Observable<SearchResponse> {
    let httpParams = new HttpParams().set('q', params.q);
    if (params.source) httpParams = httpParams.set('source', params.source);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.page_size) httpParams = httpParams.set('page_size', params.page_size.toString());

    return this.http.get<SearchResponse>(`${this.baseUrl}/search`, { params: httpParams });
  }
}
