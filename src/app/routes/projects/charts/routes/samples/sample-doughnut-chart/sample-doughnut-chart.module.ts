import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SampleDoughnutChartComponent } from "./sample-doughnut-chart.component";
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    ChartsModule, SharedModule
  ],
  declarations: [
    SampleDoughnutChartComponent
  ],
  exports: [
    SampleDoughnutChartComponent

  ],
  providers: [ ]
})
export class SampleDoughnutChartModule { }
