import { Component, EventEmitter, OnInit } from '@angular/core';

import { Chart } from "../../../../../shared/models/Chart";
import { ChartColl } from "../../../../../shared/models/ChartColl";
import { ChartSrc_UserData } from "../../../../../shared/models/ChartSrc_UserData";

import { UserDataService } from "../../../../../shared/services/user-data.service";

interface Sample {
	chart: Chart,
	emitter: EventEmitter<any>,
	isReady: boolean
}

@Component({
  // moduleId: module.id,
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.css'],
})
export class SamplesComponent implements OnInit {
	private chartIds: number[] = [1, 2, 3];
	private samples: Array<Sample> = [];
	private chart: Chart;
	private chartIsReady: boolean = false;
	private emUpdateChartPreview: EventEmitter<any> = new EventEmitter();

  constructor(
  	private userDataService: UserDataService
  ) {}

  ngOnInit() {
  	this.getSamples();
  }

  private getSamples() : void {
  	for (let i = 0; i < this.chartIds.length; i++) {
		this.userDataService.getItem('charts', this.chartIds[i]).then(chart => {
			let chartSrc: ChartSrc_UserData = <ChartSrc_UserData>chart;
			let sampleChart: Chart = new Chart();
			let sampleEmitter: EventEmitter<any> = new EventEmitter();
			let sampleIsReady: boolean = false;
			this.samples.push({
				chart: sampleChart,
				emitter: sampleEmitter,
				isReady: sampleIsReady
			});
			this.samples[i].chart.importPropsFromSrc_UserData(
				chartSrc, this.userDataService
			).then(() => this.samples[i].isReady = true);
		});
  	}
  }
}
