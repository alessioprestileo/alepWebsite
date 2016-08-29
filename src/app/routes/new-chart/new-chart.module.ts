import { NgModule }           from '@angular/core';

import { ROUTING } from "./new-chart.routing";
import { NewChartComponent }   from './new-chart.component';
import { SharedModule } from "../../shared/shared.module";
import { BaseChartModule } from "../../shared/show-chart/base-chart.module";

@NgModule({
  imports:      [ BaseChartModule, ROUTING, SharedModule ],
  declarations: [ NewChartComponent ],
  exports:      [ ],
  providers:    [ ]
})
export class NewChartModule { }
