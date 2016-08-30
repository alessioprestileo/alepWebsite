import { Component, OnInit } from '@angular/core';

import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { ChartsNavComponent } from '../shared/charts-nav.component'
import { DataSet } from "../../../../shared/models/DataSet";
import { ServerService } from '../../../../shared/services/server.service'

@Component({
  moduleId: module.id,
  selector: 'app-new-chart',
  templateUrl: 'new-chart.component.html',
  styleUrls: ['new-chart.component.css'],
  directives: [CHART_DIRECTIVES, ChartsNavComponent]
})
export class NewChartComponent implements OnInit {
  private chartOptions: any;
  private chartLabels: string[];
  private chartType: string;
  private chartLegend: boolean;
  private chartData: any[];
  private dataSets: DataSet[];


  constructor(
      private serverService: ServerService) {}

  ngOnInit() {
    this.getData('Field', 'AVG_TOT_ASSETS').then(
      (dataSets: DataSet[]) : void => {
        this.dataSets = dataSets;
        this.setChartOptions();
        this.setChartType('bar');
        this.toggleChartLegend(true);
        this.setChartData(dataSets);
      }
    );
  }

  private setChartData(dataSets: DataSet[]) : void {
    this.chartLabels = [];
    this.chartData = [];
    let labels: string[];
    let firstDataSet: boolean = true;
    let dataSetsLength = dataSets.length;
    for (let i = 0; i < dataSetsLength; i++) {
      if (firstDataSet) {
        labels = [];
      }
      let dataPoints: Object = dataSets[i].DataPoints;
      let data: number[] = [];
      for (let label in dataPoints){
        if (firstDataSet) {
          labels.push(label);
        }
        data.push(dataPoints[label]);
      }
      if (firstDataSet) {
        this.chartLabels = labels;
        firstDataSet = false;
      }
      let dataSet: Object = {
        data: data,
        label: dataSets[i].Field
      }
      this.chartData.push(dataSet);
    }
  }
  private setChartOptions() : void {
    this.chartOptions = {
      responsive: true
    };
  }
  private setChartType(type: string) : void {
    this.chartType = type;
  }
  private getData(filterBy: string, value: string) : Promise<DataSet[]> {
    return this.serverService.getFilteredDataSetsEquals(filterBy, value);
  }
  private toggleChartLegend(state: boolean) : void {
    this.chartLegend = state;
  }
}
