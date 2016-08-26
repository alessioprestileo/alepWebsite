import { Routes, RouterModule } from '@angular/router';

import * as ROUTING_LABELS from './app.routing-labels'

export const ROUTES_DICT: {[name: string] : string} = {
  LAB: ROUTING_LABELS.LAB,
  NEW_CHART: ROUTING_LABELS.NEW_CHART,
  SAMPLES: ROUTING_LABELS.SAMPLES
  };

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: ROUTING_LABELS.SAMPLES,
    pathMatch: 'full'
  }
];

export const ROUTING = RouterModule.forRoot(appRoutes);
