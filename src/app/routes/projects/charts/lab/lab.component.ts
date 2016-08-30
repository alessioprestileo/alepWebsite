import { Component, OnInit } from '@angular/core';

import { ChartsNavComponent } from '../shared/charts-nav.component'
import { ChartFormComponent } from '../../../../shared/app-forms/chart-form/chart-form.component';

@Component({
  moduleId: module.id,
  selector: 'app-lab',
  templateUrl: 'lab.component.html',
  styleUrls: ['lab.component.css'],
  directives: [ChartFormComponent, ChartsNavComponent]
})
export class LabComponent implements OnInit {

  constructor() {}

  ngOnInit() {}
}
