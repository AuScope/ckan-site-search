import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchBar } from '../../components/search-bar/search-bar';
import { ApiService } from '../../services/api.service';
import { SearchResponse, SearchResultItem } from '../../models/search';

@Component({
  selector: 'app-results',
  imports: [SearchBar, RouterLink],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  query = '';
  results: SearchResultItem[] = [];
  total = 0;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'] || '';
      if (this.query) {
        this.performSearch();
      }
    });
  }

  onSearch(query: string): void {
    this.router.navigate(['/results'], { queryParams: { q: query } });
  }

  private performSearch(): void {
    this.loading = true;
    this.error = '';
    this.api.search({ q: this.query }).subscribe({
      next: (response: SearchResponse) => {
        this.results = response.results;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Search failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
