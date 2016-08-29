import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormControl,
  FormGroup, Validators } from '@angular/forms';

import { Subscription }   from 'rxjs/Rx';

import { AppChartCollection } from "../../../models/AppChartCollection";
import { InputBoxComponent } from '../../input-box/input-box.component';
import { DataSetFormComponent } from './dataset-form/dataset-form.component';

@Component({
  moduleId: module.id,
  selector: 'app-collection-form',
  templateUrl: 'collection-form.component.html',
  styleUrls: ['collection-form.component.css'],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES,
    DataSetFormComponent, InputBoxComponent]
})
export class CollectionFormComponent implements DoCheck, OnDestroy, OnInit {
  @Input() private currentPosition: number;
  @Input() private currentCollection: AppChartCollection;
  @Input() private formGroup: FormGroup;

  private subDataSetRadio: Subscription;
  private subNameControl: Subscription;

  private titleLabel: string;

  constructor() {}

  ngOnInit() {
    this.titleLabel = 'Collection';
    this.addFormControls();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.formGroup.addControl('dataSet-radio', new FormControl( 'option1'));
    this.formGroup.addControl('name',
      new FormControl(this.currentCollection.name,
        Validators.required));
    this.subDataSetRadio = this.formGroup.controls['dataSet-radio']
                                         .valueChanges.subscribe(
      () => this.formGroup.updateValueAndValidity()
    );
    this.subNameControl = this.formGroup.controls['name']
                                        .valueChanges.subscribe(
      (value: string) : void => {
        this.formGroup.updateValueAndValidity();
        this.currentCollection.name = value;
      }
    );
  }
  private cancelSubs() : void {
    this.subDataSetRadio.unsubscribe();
    this.subNameControl.unsubscribe();
  }
  public onClickRadioInput(selectElm: HTMLInputElement,
                           deselectElms: HTMLInputElement[]) {
    let length: number = deselectElms.length;
    for (let i = 0; i < length; i++) {
      deselectElms[i].checked = false;
    }
    (<FormControl>this.formGroup.controls['dataSet-radio'])
                                .updateValue(selectElm.value);
  }
}
