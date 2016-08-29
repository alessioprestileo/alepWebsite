import { NgModule }           from '@angular/core';

import { BaseChartModule } from "./base-chart.module";
import { SharedModule } from "../shared.module";
import { ShowChartComponent } from './show-chart.component';

@NgModule({
  imports:      [
    BaseChartModule,
    SharedModule ],
  declarations: [ ShowChartComponent ],
  exports:      [ ShowChartComponent ],
  providers:    [ ]
})
export class ShowChartModule { }
