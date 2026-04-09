import { Component } from '@angular/core';
import { CataloguePage } from '../catalogue/catalogue';

@Component({
  selector: 'app-instruments',
  imports: [CataloguePage],
  template: `<app-catalogue
    sourceKey="pidinst_repo"
    pageTitle="Instruments"
    pageDescription="Scientific instruments registered with persistent identifiers (PIDInst)"
    badgeClass="badge-instrument"
  />`,
})
export class Instruments {}
