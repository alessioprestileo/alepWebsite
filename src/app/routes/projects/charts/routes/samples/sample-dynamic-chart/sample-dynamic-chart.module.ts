import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SampleDynamicChartComponent } from "./sample-dynamic-chart.component";
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    ChartsModule, SharedModule
  ],
  declarations: [
    SampleDynamicChartComponent
  ],
  exports: [
    SampleDynamicChartComponent

  ],
  providers: [ ]
})
export class SampleDynamicChartModule { }
