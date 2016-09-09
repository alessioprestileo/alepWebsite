import { NgModule }           from '@angular/core';

import { LabModule } from './projects/charts/routes/lab/lab.module';
import { NewChartModule } from './projects/charts/routes/new-chart/new-chart.module';
import { SamplesModule } from './projects/charts/routes/samples/samples.module';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports:      [
    // LabModule,
    NewChartModule, SamplesModule, SharedModule ],
  declarations: [ ],
  exports:      [
    // LabModule,
    NewChartModule, SamplesModule ],
  providers:    [ ]
})
export class RoutesModule { }
