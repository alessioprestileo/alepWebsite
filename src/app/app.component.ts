import { AfterViewChecked, Component, DoCheck, Inject, OnInit, OnDestroy } from '@angular/core';
import { Location }    from '@angular/common';

import { Subscription }   from 'rxjs/Rx';

import { AppRoutingService } from './shared/services/app-routing.service';
import { iNavButton } from "./shared/models/iNavButton";
import { NavigationComponent } from './shared/navigation/navigation.component';
import { SiteMapComponent } from './shared/site-map/site-map.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [NavigationComponent, SiteMapComponent]
})
export class AppComponent implements AfterViewChecked, DoCheck,
                                     OnDestroy, OnInit {
  private currentUrl: string;
  private navInput: any[];
  private ngDoCheckOnResizeCalls: number = 0;
  private prevBrowserPath: string;
  private projectTitles: string[];
  private siteMapInput: any[];
  private subCurrentUrl: Subscription;
  private title: string;

  constructor(@Inject('ROUTES_DICT') private ROUTES_DICT,
              private location: Location,
              private appRoutingService: AppRoutingService) {
  }
  ngOnInit() {
    window.onresize = AppComponent.onResize;
    this.title = 'Alessio\'s Website';
    this.projectTitles = ['Charts Project', 'Warehouse Project'];
    this.subCurrentUrl = this.appRoutingService.currentUrl.subscribe(
      (url: string) : void => {
        this.currentUrl = url;
        this.setSiteMapInput(url);
      });
    this.setNavInput();
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.cancelSubs();
  }
  ngAfterViewChecked() {
    // Call onResize to get changes in header or footer size due to routing
    AppComponent.onResize();
  }
  ngDoCheck() {
    // Perform checks for time travel
    this.checkTimeTravel();
    // Perform checks for route re-direct
    this.checkRouteReDirect();
  }

  private cancelSubs() : void {
    this.subCurrentUrl.unsubscribe();
  }
  private checkRouteReDirect() : void {
    let browserPath: string = this.location.path();
    if ((browserPath) && (browserPath === this.prevBrowserPath)) {
      if (browserPath !== this.currentUrl) {
        this.appRoutingService.navigate([browserPath]);
      }
    }
  }
  private checkTimeTravel() : void {
    let browserPath: string = this.location.path();
    if ((browserPath) && (browserPath !== this.prevBrowserPath)) {
      this.prevBrowserPath = browserPath;
      if (browserPath !== this.currentUrl) {
        let link:string[] = [browserPath];
        this.appRoutingService.navigate(link);
      }
    }
  }
  private static onResize() : void {
    let header: HTMLElement;
    let headerHeight: number;
    let footerHeight: number;
    let routerOutlet: HTMLElement;
    header = document.getElementById("app-header");
    header.style.minHeight = 0.234 * window.innerHeight + 'px';
    headerHeight = document.getElementById("app-header")
                                       .clientHeight;
    footerHeight = document.getElementById("app-footer")
                                       .clientHeight;
    routerOutlet = document.getElementById("app-routerOutlet");
    routerOutlet.style.minHeight = 0.98 * window.innerHeight - headerHeight -
                                   footerHeight + 'px';
  }
  public onSiteMapClick(link: string[]) : void {
    this.appRoutingService.navigate(link);
  }
  private setNavInput() : void {
    let columnsPerSec: number;
    let navLevel: number;
    let navSections: iNavButton[];
    let sectionsPerRow: number;
    navSections = [
      {
        label: 'Home',
        link: ['/' + this.ROUTES_DICT.HOME]
      },
      {
        label: 'Who Am I?',
        link: ['/' + this.ROUTES_DICT.WHO_AM_I]
      },
      {
        label: 'My CV',
        link: ['/' + this.ROUTES_DICT.MY_CV]
      },
      {
        label: 'Projects',
        link: ['/' + this.ROUTES_DICT.PROJECTS]
      }
    ];
    columnsPerSec = 2;
    navLevel = 1;
    sectionsPerRow = 4;
    this.navInput = [navLevel, navSections, columnsPerSec, sectionsPerRow];
  }
  private setSiteMapInput(currentUrl: string) : void {
    let labels: string[] = [];
    let links: string[][] = [[]];
    let parentLink: string[] = [''];
    let splitUrl: string[] = currentUrl.split('/').splice(1);
    let urlLength: number = splitUrl.length;
    for (let i = 0; i < urlLength; i++) {
      let link: string[] = [parentLink[0] + '/' + splitUrl[i]];
      parentLink[0] = link[0];
      links[i] = link;
      labels[i] = splitUrl[i].replace(/[_]+/g, ' ');
    }
    this.siteMapInput = [labels, links];
  }
}
