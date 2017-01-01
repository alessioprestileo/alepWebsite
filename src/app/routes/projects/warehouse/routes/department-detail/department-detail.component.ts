import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';

declare var jQuery: any;

@Component({
  // moduleId: module.id,
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css'],

})

export class DepartmentDetailComponent
implements DoCheck, OnDestroy, OnInit {

  constructor() {
  }

  ngOnInit() {
    this.setDarkBackground();
  }

  ngOnDestroy() {
    this.removeDarkBackground();
  }
  ngDoCheck() {
  }

  private removeDarkBackground() {
    jQuery("#app-router-outlet").addClass("app-backgroundLight");
    jQuery("#app-router-outlet").removeClass("app-backgroundDark");
  }
  private setDarkBackground() {
    jQuery("#app-router-outlet").addClass("app-backgroundDark");
    jQuery("#app-router-outlet").removeClass("app-backgroundLight");
  }
}
