import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SearchParams, SearchResponse, StatsResponse } from '../models/search';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  search(params: SearchParams): Observable<SearchResponse> {
    let httpParams = new HttpParams().set('q', params.q);
    if (params.source) httpParams = httpParams.set('source', params.source);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.page_size) httpParams = httpParams.set('page_size', params.page_size.toString());
    if (params.date_from) httpParams = httpParams.set('date_from', params.date_from);
    if (params.date_to) httpParams = httpParams.set('date_to', params.date_to);
    if (params.location_choice) httpParams = httpParams.set('location_choice', params.location_choice);
    if (params.sample_type) httpParams = httpParams.set('sample_type', params.sample_type);
    if (params.resource_type) httpParams = httpParams.set('resource_type', params.resource_type);
    if (params.fields_of_research) httpParams = httpParams.set('fields_of_research', params.fields_of_research);
    if (params.instrument_classification) httpParams = httpParams.set('instrument_classification', params.instrument_classification);

    return this.http.get<SearchResponse>(`${this.baseUrl}/search`, { params: httpParams });
  }

  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.baseUrl}/stats`);
  }
}
