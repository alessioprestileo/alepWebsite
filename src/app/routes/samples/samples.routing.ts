import { RouterModule }  from '@angular/router';

import { SamplesComponent } from './samples.component';
import * as ROUTING_LABELS from '../../app.routing-labels'

export const ROUTING = RouterModule.forChild([
  { path: ROUTING_LABELS.SAMPLES, component: SamplesComponent}
]);
