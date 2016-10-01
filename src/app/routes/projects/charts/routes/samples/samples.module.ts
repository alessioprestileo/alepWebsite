import { NgModule }           from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SampleBarChartModule }   from './sample-bar-chart/sample-bar-chart.module';
import { SampleDoughnutChartModule }   from './sample-doughnut-chart/sample-doughnut-chart.module';
import { SampleDynamicChartModule }   from './sample-dynamic-chart/sample-dynamic-chart.module';
import { SampleLineChartModule }   from './sample-line-chart/sample-line-chart.module';
import { SamplePieChartModule }   from './sample-pie-chart/sample-pie-chart.module';
import { SamplePolarAreaChartModule }   from './sample-polar-area-chart/sample-polar-area-chart.module';
import { SampleRadarChartModule }   from './sample-radar-chart/sample-radar-chart.module';
import { SamplesComponent }   from './samples.component';
import { SharedModule } from "../../../../../shared/shared.module";


@NgModule({
  imports: [
    ChartsModule, SampleBarChartModule, SampleDoughnutChartModule,
    SampleDynamicChartModule, SampleLineChartModule,
    SamplePieChartModule, SamplePolarAreaChartModule,
    SampleRadarChartModule, SharedModule
  ],
  declarations: [
    SamplesComponent
  ],
  exports: [
    SamplesComponent
  ],
  providers: [ ]
})
export class SamplesModule { }
