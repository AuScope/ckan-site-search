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
  @Output() searchSubmit = new EventEmitter<string>();

  onSubmit(): void {
    const trimmed = this.query.trim();
    if (trimmed) {
      this.searchSubmit.emit(trimmed);
    }
  }
}
