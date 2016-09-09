import { Component, OnInit } from '@angular/core';

import { ChartFormComponent } from '../../../../../shared/app-forms/chart-form/chart-form.component';

@Component({
  moduleId: module.id,
  selector: 'app-new-chart',
  templateUrl: 'new-chart.component.html',
  styleUrls: ['new-chart.component.css'],
  directives: [ChartFormComponent]
})
export class NewChartComponent implements OnInit {

  constructor() {}

  ngOnInit() {}
}
