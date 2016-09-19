import {Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {BehaviorSubject, Subscription }   from 'rxjs/Rx';

import { ChartCollSrc_UserData } from "../../../../../models/ChartCollSrc_UserData";
import { DataSet } from "../../../../../models/DataSet";
import { UserDataService } from '../../../../../services/user-data.service';

@Component({
  moduleId: module.id,
  selector: 'app-from-user-data',
  templateUrl: 'from-user-data.component.html',
  styleUrls: ['from-user-data.component.css'],
  directives: []
})
export class FromUserDataComponent
implements DoCheck, OnDestroy, OnInit {
  @Input() private currentDataSet: DataSet;
  @Input() private formGroup: FormGroup;
  private collSrcs: ChartCollSrc_UserData[];
  private obCollSrc: BehaviorSubject<ChartCollSrc_UserData>;
  private selectMode: boolean = true;
  private subCollSrc: Subscription;

  constructor(
    private userDataService: UserDataService
  ) {
  }
  ngOnInit() {
    this.addFormControls();
    this.createObsAndSubs();
    this.setCollSrcs();
  }
  ngOnDestroy() {
    this.removeFormControls();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.formGroup.addControl('from-collection', new FormControl(
      null, Validators.required
    ));
  }
  private createObsAndSubs() : void {
    this.obCollSrc = new BehaviorSubject<ChartCollSrc_UserData>(
      new ChartCollSrc_UserData()
    );
    this.subCollSrc = this.obCollSrc.subscribe(
      (collSrc: ChartCollSrc_UserData) => {
        this.formGroup.controls['from-collection'].setValue(collSrc.name);
      });
  }
  public onCollSrcSelected(index: number) : void {
    let selectedSrc: ChartCollSrc_UserData = this.collSrcs[index];
    this.selectMode = false;
    this.obCollSrc.next(selectedSrc);
    this.currentDataSet.dataPoints = selectedSrc.dataSet.dataPoints;
    this.currentDataSet.field = selectedSrc.dataSet.field;
    this.currentDataSet.ticker = selectedSrc.dataSet.ticker;
  }
  public onToggleSelectMode() : void {
    this.selectMode = !this.selectMode;
    if (this.selectMode) {
      this.formGroup.controls['from-collection'].setValue('')
    }
    this.currentDataSet.resetProps();
  }
  private removeFormControls() : void {
    this.formGroup.removeControl('from-collection');
  }
  private setCollSrcs() : void {
    this.userDataService.getAll('collections').then(
      (collections) => {
        this.collSrcs = [];
        let length: number = collections.length;
        for (let i = 0; i < length; i++) {
          let collSrc: ChartCollSrc_UserData =
            <ChartCollSrc_UserData>collections[i];
          this.collSrcs.push(collSrc);
        }
      }
    );
  }
}
