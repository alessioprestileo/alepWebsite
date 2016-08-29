import { Component, OnInit } from '@angular/core';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

@Component({
  moduleId: module.id,
  selector: 'app-sample-bar-chart',
  templateUrl: 'sample-bar-chart.component.html',
  styleUrls: ['sample-bar-chart.component.css'],
  directives: [CHART_DIRECTIVES]
})
export class SampleBarChartComponent implements OnInit {
  private barChartOptions: any;
  private barChartLabels: string[];
  private barChartType: string;
  private barChartLegend: boolean;
  private barChartData: any[];

  constructor() {}

  ngOnInit() {
    this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true
      };
    this.barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011',
      '2012'];
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartData = [
      {data: [65, 59, 80, 81, 56, 55, 40], label:'Series A'},
      {data: [28, 48, 40, 19, 86, 27, 90], label:'Series B'}
    ];
  }

  // events
  public onChartClicked(e:any):void {
    // console.log(e);
  }

  public onChartHovered(e:any):void {
    // console.log(e);
  }
}
