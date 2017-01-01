import {
  AfterViewChecked, Component, Inject, OnDestroy, OnInit, DoCheck
} from '@angular/core';
import { Location }    from '@angular/common';
import {
  FormGroup, ValidatorFn
} from '@angular/forms';

import {BehaviorSubject, Subscription } from 'rxjs/Rx';

import { AppRoutingService } from "../../../../../shared/services/app-routing.service";
import { Chart } from "../../../../../shared/models/Chart";
import { ChartColl } from "../../../../../shared/models/ChartColl";
import { ChartSrc_UserData } from "../../../../../shared/models/ChartSrc_UserData";
import { formGroupValidator } from '../../../../../shared/app-forms/formGroup.validator';
import { UserDataService } from "../../../../../shared/services/user-data.service";

@Component({
  selector: 'app-chart-detail',
  templateUrl: './chart-detail.component.html',
  styleUrls: ['./chart-detail.component.css'],
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
  private subFormGroupValid: Subscription;
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
    this.createObsAndSubs();
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
    this.subFormGroupValid.unsubscribe();
  }
  private createFormGroup() : void {
    this.formGroup = new FormGroup({}, this.formGroupValidator);
    this.subFormGroupValid = this.formGroup.valueChanges.subscribe(
      () => this.obFormGroupValid.next(this.formGroup.valid)
    );
  }
  private createObsAndSubs() : void {
    this.obFormGroupValid = new BehaviorSubject(false);
    this.subFormGroupValid = this.formGroup.valueChanges.subscribe(
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
          this.chart.importPropsFromSrc_UserData(
            chartSrc, this.userDataService
          ).then(() => this.chartIsReady = true);
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
