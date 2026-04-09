import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SearchBar } from '../../components/search-bar/search-bar';
import { FilterDialog } from '../../components/filter-dialog/filter-dialog';
import { Pagination } from '../../components/pagination/pagination';
import { ApiService } from '../../services/api.service';
import { SearchResponse, SearchResultItem, FilterState, FacetItem, SearchParams } from '../../models/search';

@Component({
  selector: 'app-results',
  imports: [SearchBar, FilterDialog, Pagination, RouterLink, DecimalPipe],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  query = '';
  results: SearchResultItem[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  loading = false;
  error = '';
  facets: Record<string, FacetItem[]> = {};
  filters: FilterState = this.defaultFilters();
  showMobileFilters = false;

  private readonly sourceColors: Record<string, string> = {
    data_repo: 'badge-data',
    sample_repo: 'badge-sample',
    pidinst_repo: 'badge-instrument',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'] || '*:*';
      this.page = parseInt(params['page'] || '1', 10);
      if (params['source']) this.filters.repository = params['source'];
      this.performSearch();
    });
  }

  onSearch(query: string): void {
    this.page = 1;
    this.router.navigate(['/results'], {
      queryParams: this.buildQueryParams(query),
    });
  }

  onFilterApply(f: FilterState): void {
    this.filters = f;
    this.page = 1;
    this.showMobileFilters = false;
    this.performSearch();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.performSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getBadgeClass(sourceKey: string): string {
    return this.sourceColors[sourceKey] || '';
  }

  truncate(text: string | undefined, maxLen = 250): string {
    if (!text) return '';
    return text.length > maxLen ? text.substring(0, maxLen) + '…' : text;
  }

  private performSearch(): void {
    this.loading = true;
    this.error = '';
    const params: SearchParams = {
      q: this.query,
      page: this.page,
      page_size: this.pageSize,
    };
    if (this.filters.repository) params.source = this.filters.repository;
    if (this.filters.dateFrom) params.date_from = this.filters.dateFrom;
    if (this.filters.dateTo) params.date_to = this.filters.dateTo;
    if (this.filters.locationChoice) params.location_choice = this.filters.locationChoice;
    if (this.filters.sampleType) params.sample_type = this.filters.sampleType;
    if (this.filters.resourceType) params.resource_type = this.filters.resourceType;
    if (this.filters.fieldsOfResearch) params.fields_of_research = this.filters.fieldsOfResearch;
    if (this.filters.instrumentClassification) params.instrument_classification = this.filters.instrumentClassification;

    this.api.search(params).subscribe({
      next: (response: SearchResponse) => {
        this.results = response.results;
        this.total = response.total;
        this.facets = response.facets || {};
        this.loading = false;
      },
      error: () => {
        this.error = 'Search failed. Please try again.';
        this.loading = false;
      },
    });
  }

  private buildQueryParams(query: string): Record<string, string> {
    const params: Record<string, string> = { q: query };
    if (this.filters.repository) params['source'] = this.filters.repository;
    return params;
  }

  defaultFilters(): FilterState {
    return { repository: '', dateFrom: '', dateTo: '', locationChoice: '', sampleType: '', resourceType: '', fieldsOfResearch: '', instrumentClassification: '' };
  }
}
