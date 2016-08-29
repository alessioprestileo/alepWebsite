import { Routes, RouterModule } from '@angular/router';

import * as ROUTING_LABELS from './app.routing-labels'

import { LabComponent } from './routes/lab/lab.component';
import { NewChartComponent } from './routes/new-chart/new-chart.component';
import { SamplesComponent } from './routes/samples/samples.component';

export const ROUTES_DICT: {[name: string] : string} = {
  LAB: ROUTING_LABELS.LAB,
  NEW_CHART: ROUTING_LABELS.NEW_CHART,
  SAMPLES: ROUTING_LABELS.SAMPLES
  };

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: ROUTING_LABELS.SAMPLES,
    pathMatch: 'full'
  },
  {
    path: ROUTING_LABELS.LAB,
    component: LabComponent
  },
  {
    path: ROUTING_LABELS.NEW_CHART,
    component: NewChartComponent
  },
  {
    path: ROUTING_LABELS.SAMPLES,
    component: SamplesComponent
  }
];

export const ROUTING = RouterModule.forRoot(APP_ROUTES);
