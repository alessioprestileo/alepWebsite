import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-sample-polar-area-chart',
  templateUrl: 'sample-polar-area-chart.component.html',
  styleUrls: ['sample-polar-area-chart.component.css']
})
export class SamplePlotAreaChartComponent implements OnInit {
  private polarAreaChartLabels: string[];
  private polarAreaChartData: number[];
  private polarAreaLegend: boolean;
  private polarAreaChartType: string;

  constructor() {}

  ngOnInit() {
    this.polarAreaChartLabels = ['Download Sales', 'In-Store Sales',
      'Mail Sales', 'Telesales', 'Corporate Sales'];
    this.polarAreaChartData = [300, 500, 100, 40, 120];
    this.polarAreaLegend = true;
    this.polarAreaChartType = 'polarArea';
  }

  public chartClicked(e:any):void {
    // console.log(e);
  }
  public chartHovered(e:any):void {
    // console.log(e);
  }
}
