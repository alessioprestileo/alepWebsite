import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription }   from 'rxjs/Rx';

import {Chart} from "../models/Chart";
import {ChartColl} from "../models/ChartColl";
import {DataSet} from "../models/DataSet";

@Component({
  moduleId: module.id,
  selector: 'app-show-chart',
  templateUrl: 'show-chart.component.html',
  styleUrls: ['show-chart.component.css']
})
export class ShowChartComponent implements DoCheck, OnDestroy, OnInit {
  @Input() chart: Chart;
  @Input() obUpdateFlag: Observable<boolean>;
  private chartOptions: any;
  private chartLabels: string[];
  private chartType: string;
  private chartLegend: boolean;
  private chartData: any[];
  private dataSets: DataSet[];
  private validInputChart: boolean = true;
  private subUpdateFlag: Subscription;
  private title: string;

  constructor() {}

  ngOnInit() {
    this.subUpdateFlag =  this.obUpdateFlag.subscribe(
      (flag: boolean) : void => {
        if (flag) {
          this.updateChart();
        }
      }
    );
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private cancelSubs() : void {
    this.subUpdateFlag.unsubscribe();
  }
  private getDataSets() : DataSet[] {
    let result: DataSet[] = [];
    let collections: ChartColl[] = this.chart.collections;
    let length: number = collections.length;
    for (let i = 0; i < length; i++) {
      result.push(collections[i].dataSet);
    }
    return result;
  }
  private hasValidType() : boolean {
    let result: boolean = false;
    let switcher: string = this.chart.type;
    switch (switcher) {
      case 'bar':
        result = true;
        break;
      case 'doughnut':
        result = true;
        break;
      case 'line':
        result = true;
        break;
      case 'pie':
        result = true;
        break;
      case 'polarArea':
        result = true;
        break;
      case 'radar':
        result = true;
        break;
    }
    return result;
  }
  private isValidChart(): boolean {
    let result: boolean = false;
    if (this.hasValidType()) {
      result = true;
    }
    return result;
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
      let dataPoints: Object = dataSets[i].dataPoints;
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
      let dataPoint: Object = {
        data: data,
        label: this.chart.collections[i].name
      };
      this.chartData.push(dataPoint);
    }
  }
  private setChartOptions() : void {
    this.chartOptions = {
      responsive: true
    };
  }
  private toggleChartLegend(state: boolean) : void {
    this.chartLegend = state;
  }
  private updateChart() : void {
    if (this.isValidChart()) {
      this.title = this.chart.title;
      this.dataSets = this.getDataSets();
      this.setChartOptions();
      this.chartType = this.chart.type;
      this.toggleChartLegend(true);
      this.setChartData(this.dataSets);
      this.validInputChart = true;
    }
    else {
      this.validInputChart = false;
    }
  }
}
