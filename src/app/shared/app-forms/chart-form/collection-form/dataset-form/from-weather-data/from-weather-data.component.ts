import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {BehaviorSubject, Subscription }   from 'rxjs/Rx';

import { DataSet } from "../../../../../models/DataSet";
import { WeatherService } from '../../../../../services/weather.service'

@Component({
  // moduleId: module.id,
  selector: 'app-from-weather-data',
  templateUrl: 'from-weather-data.component.html',
  styleUrls: ['from-weather-data.component.css']
})
export class FromWeatherDataComponent
implements DoCheck, OnDestroy, OnInit {
  @Input() private currentDataSet: DataSet;
  @Input() private formGroup: FormGroup;
  private props: string[];
  private obProp: BehaviorSubject<string>;
  private selectMode: boolean = true;
  private subFieldControl: Subscription;
  private subProp: Subscription;
  private subTickerControl: Subscription;

  constructor(
    private weatherService: WeatherService
  ) {
  }
  ngOnInit() {
    this.addFormControls();
    this.createObsAndSubs();
    this.setProps();
  }
  ngOnDestroy() {
    this.removeFormControls();
    this.cancelsubs();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.formGroup.addControl('from-weather-data', new FormControl(
      null, Validators.required
    ));
    this.formGroup.addControl('ticker', new FormControl(
      null, Validators.required
    ));
    this.formGroup.addControl('field', new FormControl(
      null, Validators.required
    ));

  }
  private cancelControlsSubs() : void {
    this.subFieldControl.unsubscribe();
    this.subTickerControl.unsubscribe();
  }
  private cancelsubs() : void {
    this.subProp.unsubscribe();
    this.cancelControlsSubs();
  }
  private createControlsSubs() : void {
    this.subTickerControl = this.formGroup.controls['ticker'].valueChanges.subscribe(
      (value) => {
        this.currentDataSet.ticker = value;
      }
    );
    this.subFieldControl = this.formGroup.controls['field'].valueChanges.subscribe(
      (value) => {
        this.currentDataSet.field = value;
      }
    );
  }
  private createObsAndSubs() : void {
    this.obProp = new BehaviorSubject<string>('');
    this.subProp = this.obProp.subscribe(
      (prop: string) => {
        this.formGroup.controls['from-weather-data'].setValue(prop);
      }
    );
    this.createControlsSubs();
  }
  public onPropSelected(index: number) : void {
    let selectedProp: string = this.props[index];
    this.selectMode = false;
    this.obProp.next(selectedProp);
    this.weatherService.getWeekData(selectedProp).then(
      (dataPoints) => {
        this.currentDataSet.dataPoints = dataPoints;
      }
    );
  }
  public onToggleSelectMode() : void {
    this.selectMode = !this.selectMode;
    if (this.selectMode) {
      this.formGroup.controls['from-weather-data'].setValue('')
    }
    this.currentDataSet.resetProps();
  }
  private removeFormControls() : void {
    this.formGroup.removeControl('from-weather-data');
    this.formGroup.removeControl('ticker');
    this.formGroup.removeControl('field');
  }
  private setProps() : void {
    this.weatherService.getWeekProps().then(
      (props) => {
        this.props = [];
        let length: number = props.length;
        for (let i = 0; i < length; i++) {
          this.props.push(props[i]);
        }
      }
    );
  }
}
