import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SamplePieChartComponent } from "./sample-pie-chart.component";
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    ChartsModule, SharedModule
  ],
  declarations: [
    SamplePieChartComponent
  ],
  exports: [
    SamplePieChartComponent
  ],
  providers: [ ]
})
export class SamplePieChartModule { }
