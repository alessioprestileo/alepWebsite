import { Component, OnInit } from '@angular/core';

import { ChartColl } from '../../../../../shared/models/ChartColl'
import { UserCollectionsComponent } from './user-collections/user-collections.component'
import { UserDataService } from '../../../../../shared/services/user-data.service'

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [UserCollectionsComponent]
})
export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
