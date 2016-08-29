import { NgModule }           from '@angular/core';

import { LabModule } from './lab/lab.module';
import { NewChartModule } from './new-chart/new-chart.module';
import { SamplesModule } from './samples/samples.module';
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
