import { RouterModule }  from '@angular/router';

import { NewChartComponent } from './new-chart.component';
import * as ROUTING_LABELS from '../../app.routing-labels'

export const ROUTING = RouterModule.forChild([
  { path: ROUTING_LABELS.NEW_CHART, component: NewChartComponent}
]);
