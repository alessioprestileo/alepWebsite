import { Component, OnInit } from '@angular/core';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

@Component({
  moduleId: module.id,
  selector: 'app-sample-dynamic-chart',
  templateUrl: 'sample-dynamic-chart.component.html',
  styleUrls: ['sample-dynamic-chart.component.css'],
  directives: [CHART_DIRECTIVES]
})
export class SampleDynamicChartComponent implements OnInit {
  private lineChartData: Array<any>;
  private lineChartLabels: Array<any>;
  private lineChartType: string;
  private pieChartType: string;
  private pieChartLabels: string[];
  private pieChartData: number[];

  constructor() {}

  ngOnInit() {
    // lineChart
    this.lineChartData = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
      ];
    this.lineChartLabels = ['January', 'February', 'March', 'April',
      'May', 'June', 'July'];
    this.lineChartType = 'line';
    this.pieChartType = 'pie';
    // pieChart
    this.pieChartLabels = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    this.pieChartData = [300, 500, 100];
  }

  public randomizeType():void {
    this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
    this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
  }
  public chartClicked(e:any):void {
    // console.log(e);
  }
  public chartHovered(e:any):void {
    // console.log(e);
  }
}
