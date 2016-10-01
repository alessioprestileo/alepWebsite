import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { NavButton } from "../../../../../shared/models/NavButton";
import { WarehouseDepSrc } from "../../../../../shared/models/WarehouseDepSrc";
import { WarehouseService } from '../../../../../shared/services/warehouse.service';

declare var jQuery: any;

@Component({
  // moduleId: module.id,
	selector: 'app-departments',
	templateUrl: 'departments.component.html',
	styleUrls: ['departments.component.css'],
})

export class DepartmentsComponent implements OnDestroy, OnInit {
  private depsSrcs: WarehouseDepSrc[];
  private navInput: any[];
  private title: string;

	constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private warehouseService: WarehouseService
  ) {}

	ngOnInit() {
	  this.setDarkBackground();
    this.setDepsSrcs().then(() => {
      this.title = this.setTitle();
      this.setNavInput();
    });
	}
	ngOnDestroy() {
	  this.removeDarkBackground();
  }

  private removeDarkBackground() {
    jQuery("#app-router-outlet").addClass("backgroundLight");
    jQuery("#app-router-outlet").removeClass("backgroundDark");
  }
  private setDarkBackground() {
    jQuery("#app-router-outlet").addClass("backgroundDark");
    jQuery("#app-router-outlet").removeClass("backgroundLight");
  }
  private setDepsSrcs() : Promise<void> {
    return this.warehouseService.getAll('departments').then(
      departments =>  {
        let depsSrcs: WarehouseDepSrc[] = <WarehouseDepSrc[]>departments;
        this.depsSrcs = depsSrcs;
      }
    );
  }
  private setNavInput() : void {
    let columnsPerSec: number;
    let navLevel: number;
    let navSections: NavButton[] = [];
    let sectionsPerRow: number;

    let depSrcs: WarehouseDepSrc[] = this.depsSrcs;
    let length: number = depSrcs.length;
    for (let i = 0; i < length; i++) {
      navSections.push(
        new NavButton(
          depSrcs[i].name,
          [
            '/' + this.ROUTES_DICT.PROJECTS +
            '/' + this.ROUTES_DICT.WAREHOUSE +
            '/' + this.ROUTES_DICT.DEPARTMENTS_DETAIL,
            depSrcs[i].path
          ]
        )
      );
    }
    columnsPerSec = 4;
    navLevel = 3;
    sectionsPerRow = 3;
    this.navInput = [navLevel, navSections, columnsPerSec, sectionsPerRow];
  }
  private setTitle() : string {
    let title: string;
    if (this.depsSrcs.length > 0) {
      title = "Departments explorer";
    } else {
      title = "No departments to show";
    }
    return title;
  }
}
