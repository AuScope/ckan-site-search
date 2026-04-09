import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.getStats().subscribe({
      next: (res) => {
        this.stats = res.sources;
        this.totalRecords = res.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
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
