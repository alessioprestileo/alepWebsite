import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-sample-pie-chart',
  templateUrl: 'sample-pie-chart.component.html',
  styleUrls: ['sample-pie-chart.component.css']
})
export class SamplePieChartComponent implements OnInit {
  private pieChartLabels: string[];
  private pieChartData: number[];
  private pieChartType: string;

  constructor() {}

  ngOnInit() {
    this.pieChartLabels = ['Download Sales', 'In-Store Sales',
      'Mail Sales'];
    this.pieChartData = [300, 500, 100];
    this.pieChartType = 'pie';
  }

  public onChartClicked(e:any):void {
    // console.log(e);
  }
  public onChartHovered(e:any):void {
    // console.log(e);
  }
}
