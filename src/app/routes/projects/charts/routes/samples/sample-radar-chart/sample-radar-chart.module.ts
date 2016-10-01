import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SampleRadarChartComponent } from "./sample-radar-chart.component";
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    ChartsModule, SharedModule
  ],
  declarations: [
    SampleRadarChartComponent
  ],
  exports: [
    SampleRadarChartComponent
  ],
  providers: [ ]
})
export class SampleRadarChartModule { }
