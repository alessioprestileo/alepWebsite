import { Component, Inject, OnInit } from '@angular/core';

import { NavigationComponent } from "../../../../shared/navigation/navigation.component";
import { NavButton } from "../../../../shared/models/NavButton";

@Component({
  moduleId: module.id,
  selector: 'app-warehouse-nav',
  templateUrl: 'warehouse-nav.component.html',
  styleUrls: ['warehouse-nav.component.css'],
  directives: [NavigationComponent]
})
export class WarehouseNavComponent implements OnInit {
  private navInput: any[];

  constructor(@Inject('ROUTES_DICT') private ROUTES_DICT) {}

  ngOnInit() {
    this.setNavInput();
  }

  private setNavInput() : void {
    let columnsPerSec: number;
    let navLevel: number;
    let navSections: NavButton[];
    let sectionsPerRow: number;

    navSections = [
      new NavButton(
        'Products',
        [
          '/' + this.ROUTES_DICT.PROJECTS +
          '/' + this.ROUTES_DICT.WAREHOUSE +
          '/' + this.ROUTES_DICT.PRODUCTS
        ]
      ),
      new NavButton(
        'Departments',
        [
          '/' + this.ROUTES_DICT.PROJECTS +
          '/' + this.ROUTES_DICT.WAREHOUSE +
          '/' + this.ROUTES_DICT.DEPARTMENTS
        ]
      )
    ];
    columnsPerSec = 2;
    navLevel = 3;
    sectionsPerRow = 2;
    this.navInput = [navLevel, navSections, columnsPerSec, sectionsPerRow];
  }

}
