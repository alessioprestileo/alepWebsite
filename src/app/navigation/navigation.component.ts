import {Component, Inject, OnInit } from '@angular/core';
import { Observable }   from 'rxjs/Rx';

import { iNavButton } from '../shared/models/iNavButton';
import { FluidButtonsComponent } from '../shared/fluid-buttons/fluid-buttons.component';
import { AppRoutingService } from '../shared/services/app-routing.service';

@Component({
  moduleId: module.id,
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['navigation.component.css'],
  directives: [ FluidButtonsComponent ]
})
export class NavigationComponent implements OnInit {
  private sections: iNavButton[];
  private sectionsPerRow: number;
  private columnsPerSec: number;
  private sectionsLabels: string[];
  private selectedSection$: Observable<string>;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private appRoutingService: AppRoutingService) {}

  ngOnInit() {
    this.sectionsPerRow = 3;
    this.columnsPerSec = 2; // Use even number!
    this.sectionsLabels = [];
    this.sections = [
      {
        label: 'Samples',
        link: ['/' + this.ROUTES_DICT.SAMPLES]
      },
      {
        label: 'New Chart',
        link: ['/' + this.ROUTES_DICT.NEW_CHART]
      },
      {
        label: 'Lab',
        link: ['/' + this.ROUTES_DICT.LAB]
      }
    ];
    this.selectedSection$ = this.appRoutingService.currentUrlLevel1.map(
      (currentSec: string) : string => {
        let length: number = this.sections.length;
        let result: string;
        for (let i = 0; i < length; i++) {
          let sec: iNavButton = this.sections[i];
          if (sec.link[0].split('/')[1] === currentSec) {
            result = sec.label;
          }
        }
        return result;
      }
    );
    this.setSectionLabels();
  }

  private setSectionLabels() : void {
    let length: number  = this.sections.length;
    for (let i = 0; i < length; i++) {
      this.sectionsLabels[i] = this.sections[i].label;
    }
  }
  public onSelectedSection(sctnName: string) : void {
    let length: number  = this.sections.length;
    for (let i = 0; i < length; i++) {
      if (sctnName === this.sections[i].label) {
        let link: string[] = this.sections[i].link;
        this.appRoutingService.navigate(link);
        return;
      }
    }
  }
}
