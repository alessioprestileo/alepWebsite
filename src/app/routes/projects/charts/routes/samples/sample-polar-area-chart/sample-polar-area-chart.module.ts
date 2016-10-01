import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SamplePolarAreaChartComponent } from "./sample-polar-area-chart.component";
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    ChartsModule, SharedModule
  ],
  declarations: [
    SamplePolarAreaChartComponent
  ],
  exports: [
    SamplePolarAreaChartComponent
  ],
  providers: [ ]
})
export class SamplePolarAreaChartModule { }
