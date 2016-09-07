import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, Validators
} from '@angular/forms';

import {BehaviorSubject, Subscription } from 'rxjs/Rx';

import { AppChart } from '../../models/AppChart';
import { AppChartCollection } from '../../models/AppChartCollection';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { InputBoxComponent } from '../input-box/input-box.component';
import { ShowChartComponent } from '../../show-chart/show-chart.component';

enum ArrayTypes {
  AppChartCollection,
  CollectionInput
}
class CollectionInput {
  public collectionObject: AppChartCollection;
  public form: FormGroup;
  public label: string;
  public position: number;

  constructor(collectionObject: AppChartCollection = null,
              form: FormGroup = null,
              label: string = null,
              position: number = null) {
    this.collectionObject = collectionObject;
    this.form = form;
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

  private chartForm: FormGroup;
  private chartTypeLabels: string[];
  private chartTypeDict: {[label: string] : string};
  private collapseCollectionForms: boolean = false;
  private collectionInputs: CollectionInput[] = [];
  private collectionsCount: number = 0;
  private collectionsLabel: string = 'collection';
  private currentChart: AppChart;
  private formTitle: string = 'Enter data for the new chart:';
  private nextCollectionId: number = 0;
  private obChartFormValid: BehaviorSubject<boolean>;
  private obUpdateChartPreview: BehaviorSubject<boolean>;
  private previewMode: boolean = false;
  private subChartForm: Subscription;
  private subTitleControl: Subscription;
  private subTypeControl: Subscription;

  constructor() {}

  ngOnInit() {

    this.inputChart = new AppChart();

    if (this.inputChart.collections.length === 0) {
      this.inputChart.collections.push(new AppChartCollection());
    };
    this.chartTypeLabels =  ['bar', 'doughnut', 'line', 'pie',
                             'polar area', 'radar'];
    this.chartTypeDict = {'bar': 'bar',
                          'doughnut': 'doughnut',
                          'line': 'line',
                          'pie': 'pie',
                          'polar area': 'polarArea',
                          'radar': 'radar'};
    this.obChartFormValid = new BehaviorSubject(false);
    if (this.inputChart) {
      this.currentChart = this.inputChart.createCopy();
      this.buildChartForm();
      this.initializeCollectionInputs();
    }
    else {
      this.currentChart = new AppChart();
      this.buildChartForm();
    }
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private arrayPopAt(array: any[],
                     arrayType: ArrayTypes, index: number) : any[] {
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
  private buildChartForm() : void {
    this.chartForm = new FormGroup({}, null, this.formGroupValidator);
    this.subChartForm = this.chartForm.valueChanges.subscribe(
      () => this.obChartFormValid.next(this.chartForm.valid)
    );
    this.chartForm.addControl('type', new FormControl(this.currentChart.type,
                                                      Validators.required));
    this.subTypeControl = this.chartForm.controls['type']
                                        .valueChanges.subscribe(
        (value: string) : void => {
          this.currentChart.type = value;
        }
      );
    this.chartForm.addControl('title', new FormControl(this.currentChart.title,
                                                       Validators.required));
    this.subTitleControl = this.chartForm.controls['title']
                                         .valueChanges.subscribe(
      (value: string) : void => {
        this.currentChart.title = value;
      }
    );
  }
  private cancelSubs() : void {
    this.subChartForm.unsubscribe();
    this.subTitleControl.unsubscribe();
    this.subTypeControl.unsubscribe();
  }
  public collectionAdd(target: string, index?: number) : void {
    let collectionInput = new CollectionInput();
    if (target === 'component+show-chart' ||
      ((target === 'component') && (index != null))) {
      this.collectionsCount += 1;
      this.nextCollectionId += 1;
      let label: string = this.collectionsLabel + ' ' +
        this.nextCollectionId.toLocaleString();
      if (target === 'component+show-chart') {
        this.currentChart.collections.push(new AppChartCollection());
        let length: number = this.currentChart.collections.length;
        collectionInput.collectionObject = this.currentChart.
                                                collections[length - 1];
      }
      else {
        collectionInput.collectionObject = this.currentChart.collections[index];
      }
      collectionInput.position = this.collectionsCount;
      collectionInput.label = label;
      collectionInput.form = this.collectionFormAdd(label);
    }
    else {
      console.log('ERROR: INVALID INPUT from collectionAdd method in ' +
        'ChartFormComponent');
      return null;
    }
    this.collectionInputs.push(collectionInput);
  }
  private collectionFormAdd(key: string) : FormGroup {
    this.chartForm.addControl(key, new FormGroup({}, null,
      this.formGroupValidator));
    return (<FormGroup>this.chartForm.controls[key]);
  }
  private collectionFormRemoveByKey(key: string) : void {
    this.chartForm.removeControl(key);
  }
  public collectionRemove(position: number, label: string) : void {
    let index: number = position - 1;
    this.collectionInputs = this.arrayPopAt(this.collectionInputs,
                                            ArrayTypes.CollectionInput, index);
    this.collectionFormRemoveByKey(label);
    this.currentChart.collections = this.arrayPopAt(
      this.currentChart.collections,
      ArrayTypes.AppChartCollection,
      index
    );
    this.collectionsCount -= 1;
  }
  private formGroupValidator(formGroup: FormGroup) :
                             {[errorProp: string]: boolean} {
    let foundInvalid: boolean = false;
    for (let control in formGroup.controls) {
      if (formGroup.controls[control] && !formGroup.controls[control].valid) {
        foundInvalid = true;
        break;
      }
    }
    if (foundInvalid === true) {
      return {foundInvalidControl: true};
    }
    else {
      return null;
    }
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
    (<FormControl>this.chartForm.controls['type']).updateValue(
      this.chartTypeDict[this.chartTypeLabels[index]]
    );
  }
  public onCollectionAdd() : void {
    this.collectionAdd('component+show-chart');
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
