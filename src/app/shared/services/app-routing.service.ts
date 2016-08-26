import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs/Rx';
import { Router }    from '@angular/router';

@Injectable()
export class AppRoutingService {
  public currentUrl: BehaviorSubject<string>;
  public currentUrlLevel1: BehaviorSubject<string>;
  public currentUrlLevel2: BehaviorSubject<string>;
  public currentUrlLevel3: BehaviorSubject<string>;

  constructor(
      private router: Router) {
  	this.currentUrl = new BehaviorSubject<string>('');
    this.currentUrlLevel1 = new BehaviorSubject<string>('');
    this.currentUrlLevel2 = new BehaviorSubject<string>('');
    this.currentUrlLevel3 = new BehaviorSubject<string>('');
    this.currentUrl.subscribe(
      (url: string): void => {
        if (url) {
          this.currentUrlLevel1.next(url.split('/')[1]);
          this.currentUrlLevel2.next(url.split('/')[2]);
          this.currentUrlLevel3.next(url.split('/')[3]);
        }
      });
  }

  setCurrentUrl(url: string) {
    this.currentUrl.next(url);
  }
  navigate(link: string[]) : void {
    this.router.navigate(link);
    let url: string = link.join('/');
    this.setCurrentUrl(url);
  }
}
