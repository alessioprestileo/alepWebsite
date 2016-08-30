import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from "rxjs";

import { AppRoutingService } from '../../shared/services/app-routing.service';
import { iNavButton } from "../../shared/models/iNavButton";

@Component({
  moduleId: module.id,
  selector: 'app-projects',
  templateUrl: 'projects.component.html',
  styleUrls: ['projects.component.css']
})
export class ProjectsComponent implements OnDestroy, OnInit {
  private currentUrl: string;
  private projects: iNavButton[];
  private subCurrentUrl: Subscription;

  constructor(@Inject('ROUTES_DICT') private ROUTES_DICT,
              private appRoutingService: AppRoutingService) {}

  ngOnInit() {
    this.subCurrentUrl = this.appRoutingService.currentUrl.subscribe(
      (currentUrl: string) => this.currentUrl = currentUrl);
    this.setProjectLabels();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }

  private cancelSubs() : void {
    this.subCurrentUrl.unsubscribe();
  }
  public onSelectedProject(label: string) : void {
    let link: string[] = [this.currentUrl + '/'];
    this.appRoutingService.navigate(link);

    let length: number = this.projects.length;
    for (let i = 0; i < length; i++) {
      if (label === this.projects[i].label) {
        let link: string[] = [this.currentUrl + '/' + this.projects[i].link[0]];
        this.appRoutingService.navigate(link);
        return;
      }
    }
  }
  private setProjectLabels() : void {
    this.projects = [
      {
        label: 'Charts',
        link: ['/' + this.ROUTES_DICT.CHARTS]
      },
      {
        label: 'Warehouse',
        link: ['/' + this.ROUTES_DICT.WAREHOUSE]
      },
    ];
  }
}
