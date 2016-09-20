import { Component, OnInit } from '@angular/core';

import { UserChartsComponent } from './user-charts/user-charts.component'
import { UserCollectionsComponent } from './user-collections/user-collections.component'

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [UserChartsComponent, UserCollectionsComponent]
})
export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
