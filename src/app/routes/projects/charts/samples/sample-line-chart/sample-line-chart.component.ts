import { Component, OnInit } from '@angular/core';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

@Component({
  moduleId: module.id,
  selector: 'app-sample-line-chart',
  templateUrl: 'sample-line-chart.component.html',
  styleUrls: ['sample-line-chart.component.css'],
  directives: [CHART_DIRECTIVES]
})
export class SampleLineChartComponent implements OnInit {
  private lineChartData: Array<any>;
  private lineChartLabels: Array<any>;
  private lineChartOptions: any;
  private lineChartColours: Array<any>;
  private lineChartLegend: boolean;
  private lineChartType: string;

  constructor() {}

  ngOnInit() {
    this.lineChartData = [
      {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
      {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
      {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
    ];
    this.lineChartLabels = ['January', 'February', 'March', 'April', 'May',
        'June', 'July'];
    this.lineChartOptions = {
        animation: false,
        responsive: true
      };
    this.lineChartColours = [
        { // grey
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: 'rgba(77,83,96,1)',
          pointBackgroundColor: 'rgba(77,83,96,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
      ];
    this.lineChartLegend = true;
    this.lineChartType = 'line';
  }

  public randomize(): void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }
  // events
  public onChartClicked(e:any) : void {
    // console.log(e);
  }
  public onChartHovered(e:any) : void {
    // console.log(e);
  }
}
