import {
  Component, DoCheck, Input, OnDestroy, OnInit,
} from '@angular/core';
import {
  FormControl, FormGroup, Validators
} from '@angular/forms';

import { Subscription }   from 'rxjs/Rx';

import { ChartColl } from "../../../models/ChartColl";

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.css'],
})
export class CollectionFormComponent implements DoCheck, OnDestroy, OnInit {
  @Input() private currentPosition: number;
  @Input() private currentCollection: ChartColl;
  @Input() private detachedCollection: boolean = false;
  @Input() private formGroup: FormGroup;
  private hasEmptyDataSet: boolean;
  private subLabelControl: Subscription;
  private subNameControl: Subscription;
  private titleLabel: string;

  constructor() {}

  ngOnInit() {
    this.setHasEmptyDataSet();
    this.titleLabel = 'Collection';
    this.addFormControls();
    this.createControlsSubs();
  }
  ngOnDestroy() {
    this.removeFormControls();
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.formGroup.addControl(
      'label', new FormControl(this.currentCollection.label, Validators.required)
    );
    this.formGroup.addControl(
      'name', new FormControl(this.currentCollection.name, Validators.required)
    );
  }
  private cancelControlsSubs() : void {
    this.subLabelControl.unsubscribe();
    this.subNameControl.unsubscribe();
  }
  private cancelSubs() : void {
    this.cancelControlsSubs();
  }
  private createControlsSubs() : void {
    this.subLabelControl = this.formGroup.controls['label']
      .valueChanges.subscribe(
        (value: string) : void => {
          this.currentCollection.label = value;
        }
      );
    this.subNameControl = this.formGroup.controls['name']
      .valueChanges.subscribe(
        (value: string) : void => {
          this.currentCollection.name = value;
        }
      );
  }
  private setHasEmptyDataSet() : void {
    this.hasEmptyDataSet = this.currentCollection.dataSet.isEmpty();
  }
  private removeFormControls() : void {
    this.formGroup.removeControl('label');
    this.formGroup.removeControl('name');
  }
}
