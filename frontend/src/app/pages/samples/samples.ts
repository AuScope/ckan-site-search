import { Component } from '@angular/core';
import { CataloguePage } from '../catalogue/catalogue';

@Component({
  selector: 'app-samples',
  imports: [CataloguePage],
  template: `<app-catalogue
    sourceKey="sample_repo"
    pageTitle="Samples"
    pageDescription="Physical samples including core, soil, and geological specimens"
    badgeClass="badge-sample"
  />`,
})
export class Samples {}
