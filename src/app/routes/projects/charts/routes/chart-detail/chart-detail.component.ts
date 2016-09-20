import {
  AfterViewChecked, Component, Inject, OnDestroy, OnInit, DoCheck
} from '@angular/core';
import { Location }    from '@angular/common';
import {
  REACTIVE_FORM_DIRECTIVES, FormGroup, ValidatorFn
} from '@angular/forms';

import {BehaviorSubject, Subscription } from 'rxjs/Rx';

import { AppRoutingService } from "../../../../../shared/services/app-routing.service";
import { Chart } from "../../../../../shared/models/Chart";
import { ChartColl } from "../../../../../shared/models/ChartColl";
import { ChartCollSrc_UserData } from "../../../../../shared/models/ChartCollSrc_UserData";
import { ChartFormComponent } from "../../../../../shared/app-forms/chart-form/chart-form.component";
import { ChartSrc_UserData } from "../../../../../shared/models/ChartSrc_UserData";
import { formGroupValidator } from '../../../../../shared/app-forms/formGroup.validator';
import { InputBoxComponent } from "../../../../../shared/app-forms/input-box/input-box.component";
import { UserDataService } from "../../../../../shared/services/user-data.service";

@Component({
  moduleId: module.id,
  selector: 'app-chart-detail',
  templateUrl: 'chart-detail.component.html',
  styleUrls: ['chart-detail.component.css'],
  directives: [
    ChartFormComponent, InputBoxComponent, REACTIVE_FORM_DIRECTIVES,
  ]
})
export class ChartDetailComponent
implements OnDestroy, OnInit, DoCheck, AfterViewChecked {
  private chart: Chart;
  private chartIsReady: boolean = false;
  private chartIdKeyword: string;
  private formGroup: FormGroup;
  private formGroupValidator: ValidatorFn = formGroupValidator;
  private newChart: boolean = false;
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
      if (this.chartIdKeyword) {
        this.setChart().then(() => {
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
    this.formGroup = new FormGroup({}, null, this.formGroupValidator);
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
    let collections: ChartColl[] = this.chart.collections;
    let length: number = collections.length;
    this.userDataService.getLastUsedId('collections').then(
      (id: number) => {
        let lastCollectionId: number = id;
        let counter: number = 0;
        for (let i = 0; i < length; i++) {
          this.userDataService.saveItem('collections', collections[i]).then(
            () => {
              let localCounter: number = ++counter;
              if (collections[i].id === null) {
                collections[i].id = ++lastCollectionId;
                if (localCounter === length) {
                  this.userDataService.saveItem(
                    'charts', this.chart.toChartSrc_UserData()
                  ).then(
                    () => this.onBackToDashboard()
                  );
                }
              }
              else {
                if (localCounter === length) {
                  this.userDataService.saveItem(
                    'charts', this.chart.toChartSrc_UserData()
                  ).then(
                    () => this.onBackToDashboard()
                  );
                }
              }
            }
          );
        }
      }
    );
  }
  private setChart() : Promise<any> {
    this.chartIsReady = false;
    if (this.chartIdKeyword === 'New') {
      this.newChart = true;
      let promise: Promise<any> = new Promise(
        (resolve, reject) => resolve()
      );
      return promise.then(() => {
        this.chart = new Chart();
        this.chartIsReady = true;
      });
    }
    else {
      return this.userDataService
        .getItem('charts', +this.chartIdKeyword).then(chart => {
          let chartSrc: ChartSrc_UserData = <ChartSrc_UserData>chart;
          this.chart = new Chart();
          this.chart.importPropsFromSrc_UserData(chartSrc);
          let collectionsLength: number = chartSrc.collectionsIds.length;
          for (let j = 0; j < collectionsLength; j++) {
            this.userDataService
              .getItem('collections', chartSrc.collectionsIds[j])
              .then(collection => {
                let collSrc: ChartCollSrc_UserData =
                  <ChartCollSrc_UserData>collection;
                let newColl: ChartColl = new ChartColl();
                newColl.importPropsFromSrc_UserData(collSrc);
                this.chart.collections.push(newColl);
                this.chartIsReady = (j === collectionsLength - 1);
              });
          }
        });
    }
  }
  private setIdKeyword(url: string) : void {
    let split: string[] = url.split('/');
    if (split[split.length - 2] ===
      this.ROUTES_DICT.CHARTS_DETAIL) {
      this.chartIdKeyword = split[split.length - 1];
    }
    else {
      this.chartIdKeyword = null;
    }
  }
  private setTitle() : void {
    this.title = (this.chartIdKeyword === 'New') ?
      'Insert data for the new chart' :
    'Edit data for the chart "' + this.chart.name + '"';
  }
}
