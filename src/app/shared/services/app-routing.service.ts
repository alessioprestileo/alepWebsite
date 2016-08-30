import { Injectable } from '@angular/core';
import { Router }    from '@angular/router';

import { BehaviorSubject }    from 'rxjs/Rx';

@Injectable()
export class AppRoutingService {
  public currentUrl: BehaviorSubject<string>;

  constructor(private router: Router) {
    this.currentUrl = new BehaviorSubject<string>('');
  }

  setCurrentUrl(url: string) {
    this.currentUrl.next(url);
  }
  navigate(link: string[]) : void {
    let url: string = link.join('/');
    this.setCurrentUrl(url);
    this.router.navigate(link);
  }
}
