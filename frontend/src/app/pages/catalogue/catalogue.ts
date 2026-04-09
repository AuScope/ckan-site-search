import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SearchBar } from '../../components/search-bar/search-bar';
import { FilterDialog } from '../../components/filter-dialog/filter-dialog';
import { Pagination } from '../../components/pagination/pagination';
import { ApiService } from '../../services/api.service';
import { SearchResponse, SearchResultItem, FilterState, FacetItem, SearchParams } from '../../models/search';

@Component({
  selector: 'app-catalogue',
  imports: [SearchBar, FilterDialog, Pagination, DecimalPipe],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class CataloguePage implements OnInit {
  @Input() sourceKey = '';
  @Input() pageTitle = '';
  @Input() pageDescription = '';
  @Input() badgeClass = '';

  query = '';
  results: SearchResultItem[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  loading = false;
  error = '';
  facets: Record<string, FacetItem[]> = {};
  filters: FilterState = this.defaultFilters();

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.filters.repository = this.sourceKey;
    this.performSearch();
  }

  onSearch(query: string): void {
    this.query = query === '*:*' ? '' : query;
    this.page = 1;
    this.performSearch();
  }

  onFilterApply(f: FilterState): void {
    this.filters = { ...f, repository: this.sourceKey };
    this.page = 1;
    this.performSearch();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.performSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  truncate(text: string | undefined, maxLen = 250): string {
    if (!text) return '';
    return text.length > maxLen ? text.substring(0, maxLen) + '\u2026' : text;
  }

  private performSearch(): void {
    this.loading = true;
    this.error = '';
    const params: SearchParams = {
      q: this.query || '*:*',
      source: this.sourceKey,
      page: this.page,
      page_size: this.pageSize,
    };
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
        this.error = 'Failed to load records. Please try again.';
        this.loading = false;
      },
    });
  }

  defaultFilters(): FilterState {
    return { repository: this.sourceKey, dateFrom: '', dateTo: '', locationChoice: '', sampleType: '', resourceType: '', fieldsOfResearch: '', instrumentClassification: '' };
  }
}
