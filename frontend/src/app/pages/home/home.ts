import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [SearchBar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) {}

  onSearch(query: string): void {
    this.router.navigate(['/results'], { queryParams: { q: query } });
  }
}
