import {
  AfterViewChecked, Component, Inject, OnDestroy, OnInit, DoCheck
} from '@angular/core';
import { Location }    from '@angular/common';
import {
  FormGroup, ValidatorFn
} from '@angular/forms';

import {BehaviorSubject, Subscription } from 'rxjs/Rx';

import { ChartColl } from "../../../../../shared/models/ChartColl";
import { ChartCollSrc_UserData } from "../../../../../shared/models/ChartCollSrc_UserData";
import { AppRoutingService } from "../../../../../shared/services/app-routing.service";
import { formGroupValidator } from '../../../../../shared/app-forms/formGroup.validator';
import { UserDataService } from "../../../../../shared/services/user-data.service";

@Component({
  // moduleId: module.id,
  selector: 'app-collection-detail',
  templateUrl: 'collection-detail.component.html',
  styleUrls: ['collection-detail.component.css'],
})
export class CollectionDetailComponent
implements OnDestroy, OnInit, DoCheck, AfterViewChecked {
  private collection: ChartColl;
  private collIdKeyword: string;
  private formGroup: FormGroup;
  private formGroupValidator: ValidatorFn = formGroupValidator;
  private newCollection: boolean = false;
  private obFormGroupValid: BehaviorSubject<boolean>;
  private prevBrowserPath: string;
  private subFormGroup: Subscription;
  private title: string;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private location: Location,
    private appRoutingService: AppRoutingService,
    private userDataService: UserDataService
  ) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.obFormGroupValid = new BehaviorSubject(null);
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngAfterViewChecked() {
    let browserPath: string = this.location.path();
    if (browserPath && browserPath !== this.prevBrowserPath) {
      this.prevBrowserPath = browserPath;
      this.setIdKeyword(browserPath);
      if (this.collIdKeyword) {
        this.setCollection().then(() => {
          this.setTitle();
        });
      }
    }
  }
  ngDoCheck() {
  }

  private cancelSubs() : void {
    this.subFormGroup.unsubscribe();
  }
  private createFormGroup() : void {
    this.formGroup = new FormGroup({}, this.formGroupValidator);
    this.subFormGroup = this.formGroup.valueChanges.subscribe(
      () => this.obFormGroupValid.next(this.formGroup.valid)
    );
  }
  public onBackToDashboard() : void {
    let link: string[] = [
      '/' + this.ROUTES_DICT.PROJECTS +
      '/' + this.ROUTES_DICT.CHARTS +
      '/' + this.ROUTES_DICT.DASHBOARD
    ];
    this.appRoutingService.navigate(link);
  }
  public onSave() : void {
    this.userDataService.saveItem('collections', this.collection).then(
      () => this.onBackToDashboard()
    );
  }
  private setCollection() : Promise<any> {
    if (this.collIdKeyword === 'New') {
      this.newCollection = true;
      let promise: Promise<any> = new Promise(
        (resolve, reject) => resolve()
      );
      return promise.then(() => {
        this.collection = new ChartColl();
      });
    }
    else {
      return this.userDataService
        .getItem('collections', +this.collIdKeyword).then(coll => {
          this.collection = new ChartColl();
          this.collection.importPropsFromSrc_UserData(
            <ChartCollSrc_UserData>coll
          );
        });
    }
  }
  private setIdKeyword(url: string) : void {
    let split: string[] = url.split('/');
    if (split[split.length - 2] ===
      this.ROUTES_DICT.COLLECTIONS_DETAIL) {
      this.collIdKeyword = split[split.length - 1];
    }
    else {
      this.collIdKeyword = null;
    }
  }
  private setTitle() : void {
    this.title = (this.collIdKeyword === 'New') ?
      'Insert data for the new collection' :
      'Edit data for the collection "' + this.collection.name + '"';
  }
}
