import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators, ValidatorFn
} from '@angular/forms';

import {BehaviorSubject, Subscription } from 'rxjs/Rx';

import { AppChart } from '../../models/AppChart';
import { AppChartCollection } from '../../models/AppChartCollection';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { formGroupValidator } from '../formGroup.validator';
import { InputBoxComponent } from '../input-box/input-box.component';
import { ShowChartComponent } from '../../show-chart/show-chart.component';

enum ArrayTypes {
  AppChartCollection,
  CollectionInput
}
class CollectionInput {
  public collectionObject: AppChartCollection;
  public formGroup: FormGroup;
  public label: string;
  public position: number;

  constructor(collectionObject: AppChartCollection = null,
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
  moduleId: module.id,
  selector: 'app-chart-form',
  templateUrl: 'chart-form.component.html',
  styleUrls: ['chart-form.component.css'],
  directives: [CollectionFormComponent, REACTIVE_FORM_DIRECTIVES,
               InputBoxComponent, ShowChartComponent]
})
export class ChartFormComponent implements DoCheck, OnDestroy, OnInit {
  @Input() private inputChart: AppChart;

  private chartFormGroup: FormGroup;
  private chartTypeValues: string[] =  [
    'bar', 'doughnut', 'line', 'pie', 'polarArea', 'radar'
  ];
  private chartTypeMap: {[value: string] : string} = {
    'bar': 'bar',
    'doughnut': 'doughnut',
    'line': 'line',
    'pie': 'pie',
    'polarArea': 'polar area',
    'radar': 'radar'
  };
  private collapseCollectionForms: boolean = false;
  private collectionInputs: CollectionInput[] = [];
  private collectionsCount: number = 0;
  private collectionsLabel: string = 'collection';
  private currentChart: AppChart;
  private formGroupValidator: ValidatorFn = formGroupValidator;
  private formTitle: string = 'Enter data for the new chart:';
  private nextCollectionId: number = 0;
  private obChartFormValid: BehaviorSubject<boolean>;
  private obUpdateChartPreview: BehaviorSubject<boolean>;
  private previewMode: boolean = false;
  private subChartFormGroup: Subscription;
  private subNameControl: Subscription;
  private subTitleControl: Subscription;
  private subTypeControl: Subscription;

  constructor() {}

  ngOnInit() {

    this.inputChart = new AppChart();

    if (this.inputChart.collections.length === 0) {
      this.inputChart.collections.push(new AppChartCollection());
    };
    this.obChartFormValid = new BehaviorSubject(false);
    if (this.inputChart) {
      this.currentChart = this.inputChart.createCopy();
      this.buildChartFormGroup();
      this.addControlsAndSubs();
      this.initializeCollectionInputs();
    }
    else {
      this.currentChart = new AppChart();
      this.buildChartFormGroup();
      this.addControlsAndSubs();
    }
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addControlsAndSubs() : void {
    this.chartFormGroup.addControl('name', new FormControl(
      this.currentChart.name, Validators.required
    ));
    this.subNameControl = this.chartFormGroup.controls[
      'name'
      ].valueChanges.subscribe((value: string) : void => {
        this.currentChart.name = value;
      }
    );
    this.chartFormGroup.addControl('title', new FormControl(
      this.currentChart.title, Validators.required
    ));
    this.subTitleControl = this.chartFormGroup.controls[
      'title'
      ].valueChanges.subscribe((value: string) : void => {
        this.currentChart.title = value;
      }
    );
    this.chartFormGroup.addControl('type', new FormControl(
      this.currentChart.type, Validators.required
    ));
    this.subTypeControl = this.chartFormGroup.controls['type']
      .valueChanges.subscribe(
        (value: string) : void => {
          this.currentChart.type = value;
        }
      );
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
        newArray = new Array<AppChartCollection>();
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
  private buildChartFormGroup() : void {
    this.chartFormGroup = new FormGroup({}, null, this.formGroupValidator);
    this.subChartFormGroup = this.chartFormGroup.valueChanges.subscribe(
      () => this.obChartFormValid.next(this.chartFormGroup.valid)
    );
  }
  private cancelSubs() : void {
    this.subChartFormGroup.unsubscribe();
    this.subNameControl.unsubscribe();
    this.subTitleControl.unsubscribe();
    this.subTypeControl.unsubscribe();
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
        this.currentChart.collections.push(new AppChartCollection());
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
      key, new FormGroup({}, null, this.formGroupValidator)
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
  public goBack() : void {
    window.history.back();
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
}
