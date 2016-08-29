import { NgModule }           from '@angular/core';

import { ROUTING } from "./samples.routing";
import { SampleBarChartComponent }   from './sample-bar-chart/sample-bar-chart.component';
import { SampleDoughnutChartComponent }   from './sample-doughnut-chart/sample-doughnut-chart.component';
import { SampleDynamicChartComponent }   from './sample-dynamic-chart/sample-dynamic-chart.component';
import { SampleLineChartComponent }   from './sample-line-chart/sample-line-chart.component';
import { SamplePieChartComponent }   from './sample-pie-chart/sample-pie-chart.component';
import { SamplePlotAreaChartComponent }   from './sample-polar-area-chart/sample-polar-area-chart.component';
import { SampleRadarChartComponent }   from './sample-radar-chart/sample-radar-chart.component';
import { SamplesComponent }   from './samples.component';
import { SharedModule } from "../../shared/shared.module";
import { BaseChartModule } from "../../shared/show-chart/base-chart.module";

@NgModule({
  imports:      [ BaseChartModule, ROUTING, SharedModule ],
  declarations: [ SampleBarChartComponent, SampleDoughnutChartComponent,
                  SampleDynamicChartComponent, SampleLineChartComponent,
                  SamplePieChartComponent, SamplePlotAreaChartComponent,
                  SampleRadarChartComponent, SamplesComponent ],
  exports:      [ ],
  providers:    [ ]
})
export class SamplesModule { }
