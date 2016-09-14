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
  @Input() private newDataSet: boolean = false;

  private collapseDataSetForm: boolean = false;
  private editDataSet: boolean;

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
    this.initEditDataSet();


    console.log('this.formGroup =', this.formGroup);
    console.log('this.currentDataSet =', this.currentDataSet);

    this.addControlsAndSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addControlsAndSubs() : void {
    this.formGroup.addControl('source', new FormControl(
      '', Validators.required
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
  private initEditDataSet() : void {
    this.editDataSet = this.newDataSet ? true: false;
  }
  public onSourceSelected(index: number) {
    (<FormControl>this.formGroup.controls['source']).setValue(
      this.sourcesValues[index]
    );
  }
}
