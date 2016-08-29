import { NgModule }           from '@angular/core';

import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { SharedModule } from "../shared.module";

@NgModule({
  imports: [ SharedModule ],
  declarations: [
    CHART_DIRECTIVES
  ],
  exports:      [
    CHART_DIRECTIVES
  ],
  providers:    [ ]
})
export class BaseChartModule { }
