import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterState, FacetItem } from '../../models/search';

@Component({
  selector: 'app-filter-dialog',
  imports: [FormsModule],
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.css',
})
export class FilterDialog {
  @Input() filters: FilterState = this.defaultFilters();
  @Input() facets: Record<string, FacetItem[]> = {};
  @Input() mode: 'overlay' | 'sidebar' = 'overlay';
  @Output() apply = new EventEmitter<FilterState>();
  @Output() close = new EventEmitter<void>();

  onApply(): void {
    this.apply.emit({ ...this.filters });
  }

  onClear(): void {
    this.filters = this.defaultFilters();
    this.apply.emit({ ...this.filters });
  }

  defaultFilters(): FilterState {
    return {
      repository: '',
      dateFrom: '',
      dateTo: '',
      locationChoice: '',
      sampleType: '',
      resourceType: '',
      fieldsOfResearch: '',
      instrumentClassification: '',
    };
  }
}
