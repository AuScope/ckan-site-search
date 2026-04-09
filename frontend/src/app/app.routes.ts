import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'results', loadComponent: () => import('./pages/results/results').then(m => m.Results) },
  { path: 'datasets', loadComponent: () => import('./pages/datasets/datasets').then(m => m.Datasets) },
  { path: 'instruments', loadComponent: () => import('./pages/instruments/instruments').then(m => m.Instruments) },
  { path: 'samples', loadComponent: () => import('./pages/samples/samples').then(m => m.Samples) },
  { path: 'reports', loadComponent: () => import('./pages/reports/reports').then(m => m.Reports) },
  { path: '**', redirectTo: '' },
];
