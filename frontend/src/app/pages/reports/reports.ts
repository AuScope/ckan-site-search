import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { SourceStats } from '../../models/search';

@Component({
  selector: 'app-reports',
  imports: [DecimalPipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  stats: SourceStats[] = [];
  totalRecords = 0;
  loading = true;

  private readonly colors: Record<string, string> = {
    data_repo: 'var(--color-data)',
    sample_repo: 'var(--color-sample)',
    pidinst_repo: 'var(--color-instrument)',
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getStats().subscribe({
      next: (res) => {
        this.stats = res.sources;
        this.totalRecords = res.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getColor(key: string): string {
    return this.colors[key] || 'var(--color-primary)';
  }

  getPercentage(count: number): number {
    if (this.totalRecords === 0) return 0;
    return (count / this.totalRecords) * 100;
  }
}
