import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup
} from '@angular/forms';

import {BehaviorSubject, Subscription }   from 'rxjs/Rx';

import { DataSet } from "../../../../../models/DataSet";
import { DataSetBasicHandler } from "./../DataSetBasicHandler";
import { DataSetFeedback } from "../../../../../models/DataSetFeedback";
import { DataSetBloodhoundSources } from "../../../../../models/DataSetBloodhoundSources";
import { ExternalService } from '../../../../../services/external.service';
import { FromFieldComponent } from "./from-field/from-field.component";
import { FromIdComponent } from "./from-id/from-id.component";
import { FromTickerComponent } from "./from-ticker/from-ticker.component";
import { RadioInputComponent } from "../../../../radio-input/radio-input.component";

@Component({
  moduleId: module.id,
  selector: 'app-from-external',
  templateUrl: 'from-external.component.html',
  styleUrls: ['from-external.component.css'],
  directives: [
    FromFieldComponent, FromIdComponent, FromTickerComponent,
    REACTIVE_FORM_DIRECTIVES, RadioInputComponent
  ]
})
export class FromExternalComponent
extends DataSetBasicHandler
implements DoCheck, OnDestroy, OnInit {
  @Input() protected currentDataSet: DataSet;
  @Input() private formGroup: FormGroup;

  private collapseDataSetForm: boolean = false;
  protected dataSetBloodhoundSources: DataSetBloodhoundSources = {
    'Field': {
      'defaultSource': null,
      'filteredSource': null,
    },
    'Id': {
      'defaultSource': null,
      'filteredSource': null,
    },
    'Ticker': {
      'defaultSource': null,
      'filteredSource': null,
    }
  };
  protected obDataSetFeedback: BehaviorSubject<DataSetFeedback>;
  private obRadioSelection: BehaviorSubject<string>;
  private previousDatSet: DataSet = new DataSet();
  private subRadioControl: Subscription;

  constructor(protected externalService: ExternalService) {
    super(externalService)
  }

  ngOnInit() {
    this.setDefaultDataSetBloodhoundSources();
    this.addFormControls();
    this.createObsAndSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.formGroup.addControl('dataSet-radio', new FormControl('option0'));
  }
  private cancelSubs() : void {
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
          this.currentDataSet.reset();
          this.previousDatSet.reset();
          this.resetFilteredDataSetBloodhoundSource();
          this.resetDataSetFeedback();
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
  private resetDataSetFeedback() : void {
    this.obDataSetFeedback.next(new DataSetFeedback('reset', 'reset'));
  }
}
