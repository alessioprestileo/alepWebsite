import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormControl,
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
  directives: [REACTIVE_FORM_DIRECTIVES, DataSetFormComponent,
               InputBoxComponent]
})
export class CollectionFormComponent implements DoCheck, OnDestroy, OnInit {
  @Input() private currentPosition: number;
  @Input() private currentCollection: AppChartCollection;
  @Input() private formGroup: FormGroup;

  // private collapseDataSetForm: boolean = false;
  private subNameControl: Subscription;
  private titleLabel: string;

  constructor() {}

  ngOnInit() {
    this.titleLabel = 'Collection';
    this.addFormControlsAndSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addFormControlsAndSubs() : void {
    this.formGroup.addControl(
      'name', new FormControl(this.currentCollection.name, Validators.required)
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
    this.subNameControl.unsubscribe();
  }
}
