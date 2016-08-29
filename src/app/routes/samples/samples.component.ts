import { Component, OnInit } from '@angular/core';

import { SampleLineChartComponent } from './sample-line-chart/sample-line-chart.component';
import { SampleBarChartComponent } from './sample-bar-chart/sample-bar-chart.component';
import { SampleDoughnutChartComponent } from './sample-doughnut-chart/sample-doughnut-chart.component';
import { SampleRadarChartComponent } from './sample-radar-chart/sample-radar-chart.component';
import { SamplePieChartComponent } from './sample-pie-chart/sample-pie-chart.component';
import { SamplePlotAreaChartComponent } from './sample-polar-area-chart/sample-polar-area-chart.component';
import { SampleDynamicChartComponent } from './sample-dynamic-chart/sample-dynamic-chart.component';

@Component({
  moduleId: module.id,
  selector: 'app-samples',
  templateUrl: 'samples.component.html',
  styleUrls: ['samples.component.css'],
  directives: [SampleLineChartComponent, SampleBarChartComponent,
               SampleDoughnutChartComponent, SampleRadarChartComponent,
               SamplePieChartComponent, SamplePlotAreaChartComponent,
               SampleDynamicChartComponent]
})
export class SamplesComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

}
