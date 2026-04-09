export interface SourceMeta {
  key: string;
  label: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  source: SourceMeta;
  metadata?: Record<string, unknown>;
}

export interface SearchResponse {
  query: string;
  total: number;
  page: number;
  page_size: number;
  results: SearchResultItem[];
}

export interface SearchParams {
  q: string;
  source?: string;
  page?: number;
  page_size?: number;
}
