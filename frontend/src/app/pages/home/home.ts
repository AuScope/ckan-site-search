import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SearchBar } from '../../components/search-bar/search-bar';
import { FilterDialog } from '../../components/filter-dialog/filter-dialog';
import { ApiService } from '../../services/api.service';
import { FilterState, SourceStats } from '../../models/search';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [SearchBar, FilterDialog, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  appTitle = environment.appTitle;
  showFilters = false;
  filters: FilterState = this.defaultFilters();
  stats: SourceStats[] = [];

  catalogues = [
    { key: 'data_repo', label: 'Datasets', route: '/datasets', icon: '📊', description: 'Research datasets including geoscience, geothermics, and environmental data.', color: 'var(--color-data)' },
    { key: 'pidinst_repo', label: 'Instruments', route: '/instruments', icon: '🔬', description: 'Scientific instruments registered with persistent identifiers (PIDInst).', color: 'var(--color-instrument)' },
    { key: 'sample_repo', label: 'Samples', route: '/samples', icon: '🪨', description: 'Physical samples including core, soil, and geological specimens.', color: 'var(--color-sample)' },
  ];

  constructor(private router: Router, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.getStats().subscribe(res => {
      this.stats = res.sources;
      this.cdr.detectChanges();
    });
  }

  getCount(key: string): number {
    return this.stats.find(s => s.key === key)?.count ?? 0;
  }

  onSearch(query: string): void {
    const params: Record<string, string> = { q: query };
    if (this.filters.repository) params['source'] = this.filters.repository;
    this.router.navigate(['/results'], { queryParams: params });
  }

  onFilterApply(f: FilterState): void {
    this.filters = f;
    this.showFilters = false;
  }

  navigateCatalogue(route: string): void {
    this.router.navigate([route]);
  }

  defaultFilters(): FilterState {
    return { repository: '', dateFrom: '', dateTo: '', locationChoice: '', sampleType: '', resourceType: '', fieldsOfResearch: '', instrumentClassification: '' };
  }
}
