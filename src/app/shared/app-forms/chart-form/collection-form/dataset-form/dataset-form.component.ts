import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators
} from '@angular/forms';

import { BehaviorSubject, Subscription }   from 'rxjs/Rx';

import { DataSet } from "../../../../models/DataSet";
import { FromExternalComponent } from './from-external/from-external.component'

@Component({
  moduleId: module.id,
  selector: 'app-dataset-form',
  templateUrl: 'dataset-form.component.html',
  styleUrls: ['dataset-form.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES, FromExternalComponent]
})
export class DataSetFormComponent
    implements DoCheck, OnDestroy, OnInit {
  @Input() protected currentDataSet: DataSet;
  @Input() private formGroup: FormGroup;

  private collapseDataSetForm: boolean = false;
  private obDataSetSource: BehaviorSubject<string> = new BehaviorSubject('');
  private sourcesValues: string[] =  [
    'external_source', 'user_data'
  ];
  private sourcesMap: {[label: string] : string} = {
    'external_source': 'external source',
    'user_data': 'user data'
  };
  private subDataSetSource: Subscription;

  constructor() {}

  ngOnInit() {
    this.addControlsAndSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addControlsAndSubs() : void {
    this.formGroup.addControl('source', new FormControl(
      null, Validators.required
    ));
    this.subDataSetSource = this.formGroup.controls['source']
      .valueChanges.subscribe(
        (value: string): void => {
          this.obDataSetSource.next(value);
        }
      );
  }
  private cancelSubs() : void {
    this.subDataSetSource.unsubscribe();
  }
  public onSourceSelected(index: number) {
    (<FormControl>this.formGroup.controls['source']).setValue(
      this.sourcesValues[index]
    );
  }
}
