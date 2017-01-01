import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl, FormGroup
} from '@angular/forms';

import {BehaviorSubject, Subscription }   from 'rxjs/Rx';

import { DataSet } from "../../../../../models/DataSet";
import { DataSetBasicHandler } from "./../DataSetBasicHandler";
import { DataSetFeedback } from "../../../../../models/DataSetFeedback";
import { BHSrcsDataSetSrc_External } from "../../../../../models/BHSrcsDataSetSrc_External";
import { ExternalService } from '../../../../../services/external.service';

@Component({
  // moduleId: module.id,
  selector: 'app-from-external',
  templateUrl: './from-external.component.html',
  styleUrls: ['./from-external.component.css'],
})
export class FromExternalComponent
extends DataSetBasicHandler
implements DoCheck, OnDestroy, OnInit {
  @Input() protected currentDataSet: DataSet;
  @Input() private formGroup: FormGroup;
  private collapseDataSetForm: boolean = false;
  protected dataSetSrcBloodhoundSrcs: BHSrcsDataSetSrc_External = {
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
    this.setDefaultDataSetSrcBloodhoundSrcs();
    this.addFormControls();
    this.createObsAndSubs();
  }
  ngOnDestroy() {
    this.removeControls();
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.formGroup.addControl('dataSet-radio', new FormControl('option0'));
  }
  private cancelControlsSubs() : void {
    this.subRadioControl.unsubscribe();
  }
  private cancelSubs() : void {
    this.cancelControlsSubs();
  }
  private createControlsObsAndSubs() : void {
    this.obRadioSelection = new BehaviorSubject(
      this.formGroup.controls['dataSet-radio'].value
    );
    this.subRadioControl = this.formGroup.controls['dataSet-radio']
      .valueChanges.subscribe(
        (radioSelection: string) : void => {
          this.formGroup.updateValueAndValidity();
          this.obRadioSelection.next(radioSelection);
          this.currentDataSet.resetProps();
          this.previousDatSet.resetProps();
          this.resetDataSetSrcBloodhoundSrc();
          this.resetDataSetFeedback();
        }
      );
  }
  private createObsAndSubs() : void {
    this.obDataSetFeedback = new BehaviorSubject(new DataSetFeedback());
    this.createControlsObsAndSubs();
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
  private removeControls() : void {
    this.formGroup.removeControl('dataSet-radio');
  }
  private resetDataSetFeedback() : void {
    this.obDataSetFeedback.next(
      new DataSetFeedback('resetProps', 'resetProps')
    );
  }
}
