import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SharedModule } from "../shared.module";
import { ShowChartComponent } from './show-chart.component';

@NgModule({
  imports:      [
    ChartsModule,
    SharedModule ],
  declarations: [ ShowChartComponent ],
  exports:      [ ShowChartComponent ],
  providers:    [ ]
})
export class ShowChartModule { }
