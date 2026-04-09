import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'results', loadComponent: () => import('./pages/results/results').then(m => m.Results) },
  { path: '**', redirectTo: '' },
];
