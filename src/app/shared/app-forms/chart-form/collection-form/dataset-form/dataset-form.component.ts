import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup
} from '@angular/forms';

import {BehaviorSubject, Observable, Subscription }   from 'rxjs/Rx';

import { DataSet } from "../../../../models/DataSet";
import { FromFieldComponent } from "./source-server/from-field/from-field.component";
import { FromIdComponent } from "./source-server/from-id/from-id.component";
import { FromTickerComponent } from "./source-server/from-ticker/from-ticker.component";
import { RadioInputComponent } from "../../../radio-input/radio-input.component";
import { ServerService } from '../../../../services/server.service';

class DataSetFeedback {
  prop: string;
  val: string;

  constructor(prop: string = null, val: string = null) {
    this.prop = prop;
    this.val = val;
  }
}
class DataSetInput {
  feedback: DataSetFeedback;
  radioSelection: string;

  constructor(feedback: DataSetFeedback, radioSelection: string) {
    this.feedback = feedback;
    this.radioSelection = radioSelection;
  }
}
class DataSetSearchSources {
  Field: SearchSource;
  Id: SearchSource;
  Ticker: SearchSource;

  constructor(Field: SearchSource, Id: SearchSource, Ticker: SearchSource) {
    this.Field = Field;
    this.Id = Id;
    this.Ticker = Ticker;
  }
}
class SearchSource {
  local: string[];
  prefetch: string;

  constructor(local: string[], prefetch: string) {
    this.local = local;
    this.prefetch = prefetch;
  }
}

@Component({
  moduleId: module.id,
  selector: 'app-dataset-form',
  templateUrl: 'dataset-form.component.html',
  styleUrls: ['dataset-form.component.css'],
  directives: [
    FromFieldComponent, FromIdComponent, FromTickerComponent,
    REACTIVE_FORM_DIRECTIVES, RadioInputComponent
  ]
})
export class DataSetFormComponent implements DoCheck, OnDestroy, OnInit {
  @Input() private currentDataSet: DataSet;
  @Input() private formGroup: FormGroup;

  private collapseDataSetForm: boolean = false;
  private dataSetSearchSources: DataSetSearchSources = {
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
    this.addFormControls();
    this.createObsAndSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.formGroup.addControl('dataSet-radio', new FormControl( 'option0'));
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
        this.formGroup.updateValueAndValidity();
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
      ) : DataSetInput => {

        return {'radioSelection': radioSelection, 'feedback': feedback};
      }
    );
    this.subDataSetInput = this.obDataSetInput.subscribe(
      (dataSetInput: DataSetInput) => this.processDataSetInput(dataSetInput)
    );
  }
  private dataSetFeedbackWasReset(feedback : DataSetFeedback) : boolean {
    if (feedback.prop === 'reset') {
      return true;
    }
    else {
      return false;
    }
  }
  private getDataSetFromTickerField(
    tickerValue: string, fieldValue: string
  ) : Promise<DataSet> {
    return this.serverService.getFilteredDataSetsEquals(
      'Ticker', tickerValue
    ).then(
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
  private processDataSetInput(dataSetInput : DataSetInput) : void {
    let promise : Promise<any> = new Promise(
      (resolve, reject) => resolve(dataSetInput)
    );
    promise.then((dataSetInput: DataSetInput) =>  {
      let radioSelection: string = dataSetInput.radioSelection;
      let property: string = dataSetInput.feedback.prop;
      let value: string = dataSetInput.feedback.val;
      if (this.dataSetFeedbackWasReset(dataSetInput.feedback)) {
        this.resetCurrentDataSet();
        this.resetDataSetSearchSources();
      }
      let switcher: string = radioSelection;
      switch (switcher) {
        case 'option0':
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
        case 'option1':
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
        case 'option2':
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
  private setLocalDataSetSearchSource(
    target: string, filterName: string, filterValue: string
  ) {
    this.serverService.getFilteredDataSetsEquals(filterName, filterValue).then(
      (dataSets: DataSet[]) : void => {
        this.dataSetSearchSources[target].local = [];
        let length: number = dataSets.length;
        for (let i = 0; i < length; i++) {
          this.dataSetSearchSources[target]
            .local.push(dataSets[i][target]);
        }
      }
    );
  }
}
