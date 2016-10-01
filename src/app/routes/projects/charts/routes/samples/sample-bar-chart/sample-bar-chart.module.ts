import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SampleBarChartComponent } from "./sample-bar-chart.component";
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    ChartsModule, SharedModule
  ],
  declarations: [
    SampleBarChartComponent
  ],
  exports: [
    SampleBarChartComponent
  ],
  providers: [ ]
})
export class SampleBarChartModule { }
