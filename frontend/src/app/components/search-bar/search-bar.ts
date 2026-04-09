import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Input() query = '';
  @Input() showFilterButton = false;
  @Input() compact = false;
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() filterClick = new EventEmitter<void>();

  onSubmit(): void {
    const trimmed = this.query.trim();
    this.searchSubmit.emit(trimmed || '*:*');
  }
}
