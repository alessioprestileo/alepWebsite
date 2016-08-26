import { NgModule }           from '@angular/core';

import { NewChartModule } from './new-chart/new-chart.module';
import { SamplesModule } from './samples/samples.module';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports:      [ NewChartModule, SamplesModule, SharedModule ],
  declarations: [ ],
  exports:      [ NewChartModule, SamplesModule ],
  providers:    [ ]
})
export class RoutesModule { }
