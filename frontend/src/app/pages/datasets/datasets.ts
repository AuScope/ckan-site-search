import { Component } from '@angular/core';
import { CataloguePage } from '../catalogue/catalogue';

@Component({
  selector: 'app-datasets',
  imports: [CataloguePage],
  template: `<app-catalogue
    sourceKey="data_repo"
    pageTitle="Datasets"
    pageDescription="Research datasets including geoscience, geothermics, and environmental data"
    badgeClass="badge-data"
  />`,
})
export class Datasets {}
