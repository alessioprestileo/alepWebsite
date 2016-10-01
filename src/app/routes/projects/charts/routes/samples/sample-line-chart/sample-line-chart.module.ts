import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SampleLineChartComponent } from "./sample-line-chart.component";
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    ChartsModule, SharedModule
  ],
  declarations: [
    SampleLineChartComponent
  ],
  exports: [
    SampleLineChartComponent
  ],
  providers: [ ]
})
export class SampleLineChartModule { }
