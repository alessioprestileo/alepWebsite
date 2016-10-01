import {
  Component, DoCheck, Input, OnDestroy, OnInit
} from '@angular/core';
import {
  FormControl, FormGroup, Validators
} from '@angular/forms';

import { DataSet } from "../../../../models/DataSet";

@Component({
  // moduleId: module.id,
  selector: 'app-dataset-form',
  templateUrl: 'dataset-form.component.html',
  styleUrls: ['dataset-form.component.css'],
})
export class DataSetFormComponent
implements DoCheck, OnDestroy, OnInit {
  @Input() protected currentDataSet: DataSet;
  @Input() private formGroup: FormGroup;
  @Input() private newDataSet: boolean = false;
  private collapseDataSetForm: boolean = false;
  private editDataSet: boolean;
  private sourcesValues: string[] =  [
    'weather_data', 'user_data'
  ];
  private sourcesMap: {[label: string] : string} = {
    'weather_data': 'weather data',
    'user_data': 'your collections'
  };

  constructor() {}

  ngOnInit() {
    this.initEditDataSet();
    if (this.editDataSet) {
      this.addControls();
    }
  }
  ngOnDestroy() {
  }
  ngDoCheck() {
  }

  private addControls() : void {
    this.formGroup.addControl('source', new FormControl(
      null, Validators.required
    ));
  }
  private initEditDataSet() : void {
    this.editDataSet = this.newDataSet ? true : false;
  }
  public onSourceSelected(index: number) {
    (<FormControl>this.formGroup.controls['source']).setValue(
      this.sourcesValues[index]
    );
  }
  public onToggleEditMode() : void {
    this.editDataSet = !this.editDataSet;
    if (this.editDataSet) {
      this.addControls();
    } else {
      this.removeControls();
    }
  }
  private removeControls() : void {
    this.formGroup.removeControl('source');
  }
}
