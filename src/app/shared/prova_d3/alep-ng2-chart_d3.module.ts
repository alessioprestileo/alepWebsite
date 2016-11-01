import { NgModule } from '@angular/core';

import { SharedModule } from "../shared.module";
import { AlepNg2ChartD3Component } from './alep-ng2-chart_d3.component';

@NgModule({
  declarations: [
    AlepNg2ChartD3Component
  ],
  imports: [
    SharedModule
  ],
  exports: [
    AlepNg2ChartD3Component
  ],
  providers: [ ]
})
export class AlepNg2ChartD3Module { }
