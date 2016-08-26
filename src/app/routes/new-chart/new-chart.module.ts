import { NgModule }           from '@angular/core';

import { ROUTING } from "./new-chart.routing";
import { NewChartComponent }   from './new-chart.component';
import { SharedModule } from "../../shared/shared.module";
import { ShowChartModule } from "../../shared/show-chart/show-chart.module";

@NgModule({
  imports:      [ ROUTING, SharedModule, ShowChartModule ],
  declarations: [ NewChartComponent ],
  exports:      [ ],
  providers:    [ ]
})
export class NewChartModule { }
