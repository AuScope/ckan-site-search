export interface SourceMeta {
  key: string;
  label: string;
  environment: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  doi?: string;
  doi_url?: string;
  source: SourceMeta;
  metadata?: Record<string, unknown>;
}

export interface FacetItem {
  name: string;
  count: number;
}

export interface SearchResponse {
  query: string;
  total: number;
  page: number;
  page_size: number;
  results: SearchResultItem[];
  facets?: Record<string, FacetItem[]>;
}

export interface SearchParams {
  q: string;
  source?: string;
  page?: number;
  page_size?: number;
  date_from?: string;
  date_to?: string;
  location_choice?: string;
  sample_type?: string;
  resource_type?: string;
  fields_of_research?: string;
  instrument_classification?: string;
}

export interface SourceStats {
  key: string;
  label: string;
  count: number;
  environment: string;
}

export interface StatsResponse {
  sources: SourceStats[];
  total: number;
}

export interface FilterState {
  repository: string;
  dateFrom: string;
  dateTo: string;
  locationChoice: string;
  sampleType: string;
  resourceType: string;
  fieldsOfResearch: string;
  instrumentClassification: string;
}
