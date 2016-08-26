import { Component, DoCheck, OnInit, OnDestroy } from '@angular/core';
import { Location }    from '@angular/common';
import { Subscription }   from 'rxjs/Rx';

// import { NavigationComponent } from './navigation/navigation.component';
import { AppRoutingService } from './shared/services/app-routing.service';
// import { ServerService } from './shared/services/server.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  // directives: [ROUTER_DIRECTIVES, NavigationComponent ],
  // providers: [ AppRoutingService, ServerService ]
})
export class AppComponent implements DoCheck, OnDestroy, OnInit {
  private title:string;
  private subCurrentUrl:Subscription;
  private currentUrl:string;
  private prevBrowserPath:string;

  constructor(private location: Location,
              private appRoutingService: AppRoutingService) {
  }
  ngOnInit() {
    this.title = 'Alessio\'s Website';
    this.subCurrentUrl = this.appRoutingService.currentUrl.subscribe(
      (url:string) => this.currentUrl = url);
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subCurrentUrl.unsubscribe();
  }
  ngDoCheck() {
    // ENABLE TIME TRAVEL
    let browserPath:string = this.location.path();
    if ((browserPath) && (browserPath !== this.prevBrowserPath)) {
      this.prevBrowserPath = browserPath;
      if (browserPath !== this.currentUrl) {
        let link:string[] = [browserPath];
        this.appRoutingService.navigate(link);
      }
    }
  }
}
