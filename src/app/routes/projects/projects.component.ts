import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from "rxjs";

import { AppRoutingService } from '../../shared/services/app-routing.service';
import { CarouselSlide } from "../../shared/models/CarouselSlide";


@Component({
  // moduleId: module.id,
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnDestroy, OnInit {
  private carouselSlides: CarouselSlide[];
  private currentUrl: string;
  private subCurrentUrl: Subscription;

  constructor(@Inject('ROUTES_DICT') private ROUTES_DICT,
              private appRoutingService: AppRoutingService) {}

  ngOnInit() {
    this.subCurrentUrl = this.appRoutingService.currentUrl.subscribe(
      (currentUrl: string) => this.currentUrl = currentUrl);
    this.setCarouselSlides();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }

  private cancelSubs() : void {
    this.subCurrentUrl.unsubscribe();
  }
  public onSelectedProject(projectLink: string[]) : void {
    let link: string[] = [this.currentUrl + '/' + projectLink[0]];
    this.appRoutingService.navigate(link);
  }
  private setCarouselSlides() : void {
    this.carouselSlides = [
      new CarouselSlide(
        './assets/charts.jpg', 'Charts',
        [
          // '/' + this.ROUTES_DICT.PROJECTS +
          '/' + this.ROUTES_DICT.CHARTS
        ]
      ),
      new CarouselSlide(
        './assets/warehouse.jpeg', 'Warehouse',
        [
          // '/' + this.ROUTES_DICT.PROJECTS +
          '/' + this.ROUTES_DICT.WAREHOUSE
        ]
      )
    ];
  }
}
