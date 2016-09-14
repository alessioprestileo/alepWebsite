import {
  Component, OnDestroy, OnInit, Input, DoCheck,
  Inject
} from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators, ValidatorFn
} from '@angular/forms';

import {BehaviorSubject, Subscription } from 'rxjs/Rx';

import { AppChartCollection } from "../../../../../shared/models/AppChartCollection";
import { AppRoutingService } from "../../../../../shared/services/app-routing.service";
import { CollectionFormComponent } from "../../../../../shared/app-forms/chart-form/collection-form/collection-form.component";
import { DataSetFormComponent } from "../../../../../shared/app-forms/chart-form/collection-form/dataset-form/dataset-form.component";
import { formGroupValidator } from '../../../../../shared/app-forms/formGroup.validator';
import { InputBoxComponent } from "../../../../../shared/app-forms/input-box/input-box.component";
import { UserDataService } from "../../../../../shared/services/user-data.service";

@Component({
  moduleId: module.id,
  selector: 'app-collection-detail',
  templateUrl: 'collection-detail.component.html',
  styleUrls: ['collection-detail.component.css'],
  directives: [
    CollectionFormComponent, REACTIVE_FORM_DIRECTIVES, DataSetFormComponent,
    InputBoxComponent
  ]
})
export class CollectionDetailComponent implements OnDestroy, OnInit, DoCheck {
  private collection: AppChartCollection;
  private collIdKeyword: string;
  private formGroup: FormGroup;
  private formGroupValidator: ValidatorFn = formGroupValidator;
  private obChartFormValid: BehaviorSubject<boolean>;
  private subCurrentUrl: Subscription;
  private subFormGroup: Subscription;
  private subNameControl: Subscription;
  private title: string;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private appRoutingService: AppRoutingService,
    private userDataService: UserDataService
  ) {
  }

  ngOnInit() {
    this.obChartFormValid = new BehaviorSubject(null);

    this.subCurrentUrl = this.appRoutingService.currentUrl.subscribe(
      (url: string) : void => {
        this.setIdKeyword(url);
        if (this.collIdKeyword) {
          this.setCollection().then(() => {

            console.log('url = ', url);

            this.setTitle(url);
            this.createFormGroup();
            this.addControlsAndSubs();
          });
        }
      }
    );
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {

    console.log('title = ', this.title);

  }

  private addControlsAndSubs() : void {
    this.formGroup.addControl(
      'name', new FormControl(this.collection.name, Validators.required)
    );
    this.subNameControl = this.formGroup.controls['name']
      .valueChanges.subscribe(
        (value: string) : void => {
          this.formGroup.updateValueAndValidity();
          this.collection.name = value;
        }
      );
  }
  private cancelSubs() : void {
    this.subCurrentUrl.unsubscribe();
    this.subFormGroup.unsubscribe();
    this.subNameControl.unsubscribe();
  }
  private createFormGroup() : void {
    this.formGroup = new FormGroup({}, null, this.formGroupValidator);
    this.subFormGroup = this.formGroup.valueChanges.subscribe(
      () => this.obChartFormValid.next(this.formGroup.valid)
    );
  }
  private setCollection() : Promise<any> {
    if (this.collIdKeyword === 'New') {
      let promise: Promise<any> = new Promise(
        (resolve, reject) => resolve()
      );
      return promise.then(() => {
        this.collection = new AppChartCollection();
      });
    }
    else {
      return this.userDataService
        .getItem('collections', +this.collIdKeyword).then(coll => {
          this.collection = (<AppChartCollection>coll)
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
  private setTitle(url: string) : void {


    console.log('this.collectionId = ', this.collIdKeyword);

    this.title = (this.collIdKeyword === 'New') ?
      'Insert data for the new collection' :
      'Edit data for the collection "' + this.collection.name + '"';
  }
}
