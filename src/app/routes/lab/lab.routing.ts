import { RouterModule }  from '@angular/router';

import { LabComponent } from './lab.component';
import * as ROUTING_LABELS from '../../app.routing-labels'

export const ROUTING = RouterModule.forChild([
  { path: ROUTING_LABELS.LAB, component: LabComponent}
]);
