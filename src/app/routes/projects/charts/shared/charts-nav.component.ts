import { Component, Inject, OnInit } from '@angular/core';

import { NavigationComponent } from "../../../../shared/navigation/navigation.component";
import { NavButton } from "../../../../shared/models/NavButton";

@Component({
  moduleId: module.id,
  selector: 'app-charts-nav',
  templateUrl: 'charts-nav.component.html',
  styleUrls: ['charts-nav.component.css'],
  directives: [NavigationComponent]
})
export class ChartsNavComponent implements OnInit {
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
        'Samples',
        ['/' + this.ROUTES_DICT.PROJECTS + '/' +
               this.ROUTES_DICT.CHARTS + '/' +
               this.ROUTES_DICT.SAMPLES]
      ),
      new NavButton(
        'New Chart',
        ['/' + this.ROUTES_DICT.PROJECTS + '/' +
               this.ROUTES_DICT.CHARTS + '/' +
               this.ROUTES_DICT.NEW_CHART]
      ),
      new NavButton(
        'Lab',
        ['/' + this.ROUTES_DICT.PROJECTS + '/' +
               this.ROUTES_DICT.CHARTS + '/' +
               this.ROUTES_DICT.LAB]
      )
    ];
    columnsPerSec = 2;
    navLevel = 3;
    sectionsPerRow = 3;
    this.navInput = [navLevel, navSections, columnsPerSec, sectionsPerRow];
  }

}
