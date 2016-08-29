import { Component, OnInit } from '@angular/core';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

@Component({
  moduleId: module.id,
  selector: 'app-sample-doughnut-chart',
  templateUrl: 'sample-doughnut-chart.component.html',
  styleUrls: ['sample-doughnut-chart.component.css'],
  directives: [CHART_DIRECTIVES]
})
export class SampleDoughnutChartComponent implements OnInit {
  private doughnutChartLabels: string[];
  private doughnutChartData: number[];
  private doughnutChartType: string;

  constructor() {}

  ngOnInit() {
    this.doughnutChartLabels = ['Download Sales', 'In-Store Sales',
      'Mail-Order Sales'];
    this.doughnutChartData = [350, 450, 100];
    this.doughnutChartType = 'doughnut';
  }

  public onChartClicked(e:any):void {
    // console.log(e);
  }
  public onChartHovered(e:any):void {
    // console.log(e);
  }
}
