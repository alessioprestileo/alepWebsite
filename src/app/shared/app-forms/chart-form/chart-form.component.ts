import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl, FormGroup, Validators, ValidatorFn
} from '@angular/forms';

import {BehaviorSubject, Subscription } from 'rxjs/Rx';

import { Chart } from '../../models/Chart';
import { ChartColl } from '../../models/ChartColl';
import { formGroupValidator } from '../formGroup.validator';

enum ArrayTypes {
  AppChartCollection,
  CollectionInput
}
class CollectionInput {
  public collectionObject: ChartColl;
  public formGroup: FormGroup;
  public label: string;
  public position: number;

  constructor(collectionObject: ChartColl = null,
              formGroup: FormGroup = null,
              label: string = null,
              position: number = null) {
    this.collectionObject = collectionObject;
    this.formGroup = formGroup;
    this.label = label;
    this.position = position;
  }
}

@Component({
  // moduleId: module.id,
  selector: 'app-chart-form',
  templateUrl: 'chart-form.component.html',
  styleUrls: ['chart-form.component.css'],
})
export class ChartFormComponent implements DoCheck, OnDestroy, OnInit {
  @Input() private chartFormGroup: FormGroup;
  @Input() private currentChart: Chart;
  @Input() private newChart: boolean;
  private chartTypeValues: string[] =  [
    'Bar', 'Donut', 'Line', 'Pie', 'PolarArea'
  ];
  private chartTypeMap: {[value: string] : string} = {
    'Bar': 'bar',
    'Donut': 'donut',
    'Line': 'line',
    'Pie': 'pie',
    'PolarArea': 'polar area',
  };
  private collapseCollectionForms: boolean = false;
  private collectionInputs: CollectionInput[] = [];
  private collectionsCount: number = 0;
  private collectionsLabel: string = 'collection';
  private formGroupValidator: ValidatorFn = formGroupValidator;
  private nextCollectionId: number = 0;
  private obChartFormValid: BehaviorSubject<boolean>;
  private obUpdateChartPreview: BehaviorSubject<boolean>;
  private previewMode: boolean = false;
  private subChartFormValid: Subscription;
  private subNameControl: Subscription;
  private subTitleControl: Subscription;
  private subTypeControl: Subscription;

  constructor() {}

  ngOnInit() {
    this.createObsAndSubs();
    if (this.currentChart) {
      if (!this.newChart) {
        this.addFormControls();
        this.createControlsSubs();
        this.initializeCollectionInputs();
      }
      else {
        this.addFormControls();
        this.createControlsSubs();
        this.collectionAdd('component+chart', 0);
      }
    }
  }
  ngOnDestroy() {
    this.removeFormControls();
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.chartFormGroup.addControl('name', new FormControl(
      this.currentChart.name, Validators.required
    ));
    this.chartFormGroup.addControl('title', new FormControl(
      this.currentChart.title, Validators.required
    ));
    this.chartFormGroup.addControl('type', new FormControl(
      this.currentChart.type, Validators.required
    ));
  }
  private arrayPopAt(
    array: any[], arrayType: ArrayTypes, index: number
  ) : any[] {
    let newArray;
    let type: ArrayTypes = arrayType;
    switch (type) {
      case ArrayTypes.CollectionInput:
        newArray = new Array<CollectionInput>();
        break;
      case ArrayTypes.AppChartCollection:
        newArray = new Array<ChartColl>();
        break;
    }
    let length: number = array.length;
    for (let i = 0; i < length; i++) {
      if (i < index) {
        newArray.push(array[i]);
      }
      else if (i === index) {
        continue;
      }
      else {
        if (type === ArrayTypes.CollectionInput) {
          array[i].position -= 1;
        }
        newArray.push(array[i]);
      }
    }
    return newArray;
  }
  private cancelControlsSubs() : void {
    this.subNameControl.unsubscribe();
    this.subTitleControl.unsubscribe();
    this.subTypeControl.unsubscribe();
  }
  private cancelSubs() : void {
    this.cancelControlsSubs();
    this.subChartFormValid.unsubscribe();
  }
  public collectionAdd(target: string, index?: number) : void {
    let collectionInput = new CollectionInput();
    if (target === 'component+chart' ||
      ((target === 'component') && (index != null))) {
      this.collectionsCount += 1;
      this.nextCollectionId += 1;
      let label: string = this.collectionsLabel + ' ' +
        this.nextCollectionId.toLocaleString();
      if (target === 'component+chart') {
        this.currentChart.collections.push(new ChartColl());
        let length: number = this.currentChart.collections.length;
        collectionInput.collectionObject = this.currentChart.collections[
        length - 1
          ];
      }
      else {
        collectionInput.collectionObject = this.currentChart.collections[index];
      }
      collectionInput.position = this.collectionsCount;
      collectionInput.label = label;
      collectionInput.formGroup = this.collectionFormGroupAdd(label);
    }
    else {
      console.log('ERROR: INVALID INPUT from collectionAdd method in ' +
        'ChartFormComponent');
      return null;
    }
    this.collectionInputs.push(collectionInput);
  }
  private collectionFormGroupAdd(key: string) : FormGroup {
    this.chartFormGroup.addControl(
      key, new FormGroup({}, this.formGroupValidator)
    );
    return (<FormGroup>this.chartFormGroup.controls[key]);
  }
  private collectionFormRemoveByKey(key: string) : void {
    this.chartFormGroup.removeControl(key);
  }
  public collectionRemove(position: number, label: string) : void {
    let index: number = position - 1;
    this.collectionInputs = this.arrayPopAt(
      this.collectionInputs, ArrayTypes.CollectionInput, index
    );
    this.collectionFormRemoveByKey(label);
    this.currentChart.collections = this.arrayPopAt(
      this.currentChart.collections, ArrayTypes.AppChartCollection, index
    );
    this.collectionsCount -= 1;
  }
  private createControlsSubs() : void {
    this.subNameControl = this.chartFormGroup.controls[
      'name'
      ].valueChanges.subscribe((value: string) : void => {
        this.currentChart.name = value;
      }
    );
    this.subTitleControl = this.chartFormGroup.controls[
      'title'
      ].valueChanges.subscribe((value: string) : void => {
        this.currentChart.title = value;
      }
    );
    this.subTypeControl = this.chartFormGroup.controls['type']
      .valueChanges.subscribe(
        (value: string) : void => {
          this.currentChart.type = value;
        }
      );
  }
  private createObsAndSubs() : void {
    this.obChartFormValid = new BehaviorSubject(false);
    this.subChartFormValid = this.chartFormGroup.valueChanges.subscribe(
      () => this.obChartFormValid.next(this.chartFormGroup.valid)
    );
  }
  private initializeCollectionInputs() : void {
    let length: number = this.currentChart.collections.length;
    for (let i = 0; i < length; i++) {
      this.collectionAdd('component', i);
    }
  }
  public onChartTypeSelected(index: number) {
    (<FormControl>this.chartFormGroup.controls['type']).setValue(
      this.chartTypeValues[index]
    );
  }
  public onCollectionAdd() : void {
    this.collectionAdd('component+chart');
  }
  public onCollectionRemove(position: number, label: string) : void {
    this.collectionRemove(position, label);
  }
  public onPreviewToggleOn() : void {
    this.obUpdateChartPreview = new BehaviorSubject(true);
    this.previewMode = true;
  }
  public onPreviewToggleOff() : void {
    this.previewMode = false;
  }
  public onUpdatePreview() : void {
    this.obUpdateChartPreview.next(true);
  }
  private removeFormControls() : void {
    this.chartFormGroup.removeControl('name');
    this.chartFormGroup.removeControl('title');
    this.chartFormGroup.removeControl('type');
  }
}
