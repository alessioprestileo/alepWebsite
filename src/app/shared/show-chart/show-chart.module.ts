import { NgModule }           from '@angular/core';

import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { SharedModule } from "../shared.module";
import { ShowChartComponent } from './show-chart.component';

@NgModule({
  imports:      [ SharedModule ],
  declarations: [ CHART_DIRECTIVES, ShowChartComponent ],
  exports:      [ CHART_DIRECTIVES, ShowChartComponent ],
  providers:    [ ]
})
export class ShowChartModule { }
