import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormGroup } from '@angular/forms';

import {BehaviorSubject, Observable, Subscription }   from 'rxjs/Rx';

import { DataSet } from "../../../../models/DataSet";
import { SearchBoxComponent } from '../../../../forms/search-box/search-box.component';
import { ServerService } from '../../../../services/server.service';

class DataSetFeedback {
  prop: string;
  val: string;

  constructor(prop: string = null, val: string = null) {
    this.prop = prop;
    this.val = val;
  }
}
interface iDataSetInput {
  feedback: DataSetFeedback;
  radioSelection: string;
}
interface iDataSetSearchSources {
  Field: iSearchSource;
  Id: iSearchSource;
  Ticker: iSearchSource;
}
interface iSearchSource {
  local: string[];
  prefetch: string;
}

@Component({
  moduleId: module.id,
  selector: 'app-dataset-form',
  templateUrl: 'dataset-form.component.html',
  styleUrls: ['dataset-form.component.css'],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, SearchBoxComponent]
})
export class DataSetFormComponent implements DoCheck,
                                                       OnDestroy,
                                                       OnInit {
  @Input() private currentDataSet: DataSet;
  @Input() private formGroup: FormGroup;

  private dataSetSearchSources: iDataSetSearchSources = {
    'Field': {
      'local': null,
      'prefetch': 'http://localhost:4200/app/shared/' +
      'utils/server-data-Field.json',
    },
    'Id': {
      'local': null,
      'prefetch': 'http://localhost:4200/app/shared/' +
      'utils/server-data-Id.json',
    },
    'Ticker': {
      'local': null,
      'prefetch': 'http://localhost:4200/app/shared/' +
      'utils/server-data-Ticker.json',
    }
  };
  private obDataSetFeedback: BehaviorSubject<DataSetFeedback>;
  private obDataSetInput: Observable<any>;
  private obRadioSelection: BehaviorSubject<string>;
  private previousDatSet: DataSet = new DataSet();
  private subDataSetInput: Subscription;
  private subRadioControl: Subscription;

  constructor(private serverService: ServerService) {}

  ngOnInit() {
    this.createObsAndSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {

    // console.log('this.currentDataSet.Ticker = ', this.currentDataSet.Ticker);
    // console.log('this.collectionObject = ', this.collectionObject);

  }

  private cancelSubs() : void {
    this.subDataSetInput.unsubscribe();
    this.subRadioControl.unsubscribe();
  }
  private createObsAndSubs() : void {
    this.obDataSetFeedback = new BehaviorSubject(new DataSetFeedback());
    this.obRadioSelection = new BehaviorSubject(
      this.formGroup.controls['dataSet-radio'].value
    );
    this.subRadioControl = this.formGroup.controls['dataSet-radio']
                               .valueChanges.subscribe(
      (radioSelection: string) : void => {
        this.obRadioSelection.next(radioSelection);
        this.resetCurrentDataSet();
        this.resetPreviousDataSet();
        this.resetDataSetSearchSources();
        this.resetDataSetFeedback();
      }
    );
    this.obDataSetInput = this.obRadioSelection.combineLatest(
      this.obDataSetFeedback, (
        radioSelection: string, feedback: DataSetFeedback
      ) : iDataSetInput => {

        return {'radioSelection': radioSelection, 'feedback': feedback};
      }
    );
    this.subDataSetInput = this.obDataSetInput.subscribe(
      (dataSetInput: iDataSetInput) => this.processDataSetInput(dataSetInput)
    );
  }
  private static dataSetFeedbackWasReset(feedback : DataSetFeedback) : boolean {
    if (feedback.prop === 'reset') {
      return true;
    }
    else {
      return false;
    }
  }
  private getDataSetFromTickerField(tickerValue: string,
                                    fieldValue: string) : Promise<DataSet> {
    return this.serverService.getFilteredDataSetsEquals('Ticker',
      tickerValue).then(
      (dataSets: DataSet[]) : DataSet => {
        return dataSets.filter(dataSet => dataSet.Field === fieldValue)[0];
      }
    );
  }
  private isNewDataSetFeedback(dataSetFeedback: DataSetFeedback) : boolean {
    if (this.previousDatSet[dataSetFeedback.prop] !== dataSetFeedback.val) {
      return true;
    }
    else {
      return false;
    }
  }
  public onSearchBoxNotSuccess(prop: string) : void {
    let feedback: DataSetFeedback = new DataSetFeedback(prop, null);
    if (this.isNewDataSetFeedback(feedback)) {
      this.previousDatSet[prop] = feedback.val;
      this.obDataSetFeedback.next(feedback);
    }
  }
  public onSearchBoxSuccess(info: Object) : void {
    let prop: string = info['targetProperty'];
    let val: string = info['value'];
    let feedback: DataSetFeedback = new DataSetFeedback(prop, val);
    if (this.isNewDataSetFeedback(feedback)) {
      this.previousDatSet[prop] = feedback.val;
      this.obDataSetFeedback.next(feedback);
    }
  }
  private processDataSetInput(dataSetInput : iDataSetInput) : void {
    let promise : Promise<any> = new Promise(
      (resolve, reject) => resolve(dataSetInput)
    );
    promise.then((dataSetInput: iDataSetInput) =>  {
      let radioSelection: string = dataSetInput.radioSelection;
      let property: string = dataSetInput.feedback.prop;
      let value: string = dataSetInput.feedback.val;
      if (DataSetFormComponent.dataSetFeedbackWasReset(dataSetInput.feedback)) {
        this.resetCurrentDataSet();
        this.resetDataSetSearchSources();
      }
      let switcher: string = radioSelection;
      switch (switcher) {
        case 'option1':
          switch (property) {
            case 'Ticker':
              this.resetCurrentDataSet();
              this.resetDataSetSearchSources();
              if (value) {
                this.setLocalDataSetSearchSource('Field', 'Ticker', value);
                this.currentDataSet.Ticker = value;
              }
              break;
            case 'Field':
              this.currentDataSet.Id = null;
              let tickerValue: string = this.currentDataSet.Ticker;
              if (tickerValue && value) {
                this.currentDataSet.Field = value;
                this.getDataSetFromTickerField(tickerValue, value).then(
                  (dataSet: DataSet) : void => {
                    this.currentDataSet.DataPoints = dataSet.DataPoints;
                    this.currentDataSet.Id = dataSet.Id;
                  }
                );
              }
              break;
          }
          break;
        case 'option2':
          switch (property) {
            case 'Field':
              this.resetCurrentDataSet();
              this.resetDataSetSearchSources();
              if (value) {
                this.setLocalDataSetSearchSource('Ticker', 'Field', value);
                this.currentDataSet.Field = value;
              }
              break;
            case 'Ticker':
              this.currentDataSet.Id = null;
              let fieldValue: string = this.currentDataSet.Field;
              if (fieldValue && value) {
                this.currentDataSet.Ticker = value;
                this.getDataSetFromTickerField(value, fieldValue).then(
                  (dataSet: DataSet) : void => {
                    this.currentDataSet.DataPoints = dataSet.DataPoints;
                    this.currentDataSet.Id = dataSet.Id;
                  }
                );
              }
              break;
          }
          break;
        case 'option3':
          this.resetCurrentDataSet();
          this.resetDataSetSearchSources();
          if (property === 'Id' && value) {
            this.serverService.getDataSet(value).then(
              (dataSet: DataSet) : void => {
                this.currentDataSet.DataPoints = dataSet.DataPoints;
                this.currentDataSet.Field = dataSet.Field;
                this.currentDataSet.Id = dataSet.Id;
                this.currentDataSet.Ticker = dataSet.Ticker;
              }
            );
          }
          break;
      }
    });
  }
  private resetCurrentDataSet() : void {
    let obj: DataSet = this.currentDataSet;
    for (let prop in obj) {
      if (typeof obj[prop] === 'function') {
        continue;
      }
      else {
        obj[prop] = null;
      }
    }
    obj.DataPoints = {};
  }
  private resetDataSetFeedback() : void {
    this.obDataSetFeedback.next(new DataSetFeedback('reset', 'reset'));
  }
  private resetPreviousDataSet() : void {
    this.previousDatSet = new DataSet();
  }
  private resetDataSetSearchSources() : void {
    this.dataSetSearchSources.Field.local = null;
    this.dataSetSearchSources.Ticker.local = null;
  }
  private setLocalDataSetSearchSource(target: string,
                                      filterName: string,
                                      filterValue: string) {
    this.serverService.getFilteredDataSetsEquals(filterName, filterValue).then(
      (dataSets: DataSet[]) : void => {
        this.dataSetSearchSources[target].local = [];
        let length: number = dataSets.length;
        for (let i = 0; i < length; i++) {
          this.dataSetSearchSources[target]
            .local.push(dataSets[i][target]);
        }
      });
  }
}
