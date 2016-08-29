import { Component, OnInit } from '@angular/core';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

@Component({
  moduleId: module.id,
  selector: 'app-sample-radar-chart',
  templateUrl: 'sample-radar-chart.component.html',
  styleUrls: ['sample-radar-chart.component.css'],
  directives: [CHART_DIRECTIVES]
})
export class SampleRadarChartComponent implements OnInit {
  private radarChartLabels: string[];
  private radarChartData: any;
  private radarChartType: string;

  constructor() {}

  ngOnInit() {
    this.radarChartLabels = ['Eating', 'Drinking', 'Sleeping', 'Designing',
      'Coding', 'Cycling', 'Running'];
    this.radarChartData = [
        {data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A'},
        {data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'}
      ];
    this.radarChartType = 'radar';
  }

  public onChartClicked(e:any):void {
    // console.log(e);
  }
  public onChartHovered(e:any):void {
    // console.log(e);
  }

}
