import {Component, Input, OnInit } from '@angular/core';
import { Observable }   from 'rxjs/Rx';

import { NavButton } from '../models/NavButton';
import { AppRoutingService } from '../services/app-routing.service';

@Component({
  // moduleId: module.id,
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Input() buttonType: string = 'sections';
  @Input() private elements: NavButton[];
  @Input() private columnsPerSec: number;
  @Input() private navLevel: number;
  @Input() private sectionsPerRow: number;

  private sectionsLabels: string[];
  private obSelectedSection: Observable<string>;

  constructor(private appRoutingService: AppRoutingService) {}

  ngOnInit() {
    this.sectionsLabels = [];
    this.obSelectedSection = this.appRoutingService.currentUrl.map(
      (currentUrl: string) : string => {
        let currentElem: string = currentUrl.split('/')[this.navLevel];
        let length: number = this.elements.length;
        let result: string;
        for (let i = 0; i < length; i++) {
          let sec: NavButton = this.elements[i];
          if (sec.link[0].split('/')[this.navLevel] === currentElem) {
            result = sec.label;
          }
        }
        return result;
      }
    );
    this.setSectionLabels();
  }

  private setSectionLabels() : void {
    let length: number  = this.elements.length;
    for (let i = 0; i < length; i++) {
      this.sectionsLabels[i] = this.elements[i].label;
    }
  }
  public onSelectedSection(sctnName: string) : void {
    let length: number  = this.elements.length;
    for (let i = 0; i < length; i++) {
      if (sctnName === this.elements[i].label) {
        let link: string[] = this.elements[i].link;
        this.appRoutingService.navigate(link);
        return;
      }
    }
  }
}
