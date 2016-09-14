import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormGroup } from "@angular/forms";

import {BehaviorSubject, Subscription }   from 'rxjs/Rx';

import { DataSet } from "../../../../../../models/DataSet";
import { DataSetSrc } from "../../../../../../models/DataSetSrc";
import { DataSetBasicHandler } from "../../DataSetBasicHandler";
import { DataSetFeedback } from "../../../../../../models/DataSetFeedback";
import { ExternalService } from "../../../../../../services/external.service";
import { SearchBoxComponent } from '../../../../../search-box/search-box.component';

@Component({
  moduleId: module.id,
  selector: 'app-from-field',
  templateUrl: 'from-field.component.html',
  styleUrls: ['from-field.component.css'],
  directives: [SearchBoxComponent]
})
export class FromFieldComponent
extends DataSetBasicHandler
implements OnInit, OnDestroy {
  @Input() protected currentDataSet: DataSet;
  @Input() protected dataSetSrcBloodhoundSrcs: any;
  @Input() private inFormGroup: FormGroup;
  @Input() protected obDataSetFeedback: BehaviorSubject<DataSetFeedback>;
  @Output() private hasNotSuccessEmitter = new EventEmitter();
  @Output() private hasSuccessEmitter = new EventEmitter();

  private currentDataSetSrcId: string;
  private subDataSetFeedback: Subscription;

  constructor(protected externalService: ExternalService) {
    super(externalService);
  }

  ngOnInit() {
    this.subDataSetFeedback = this.obDataSetFeedback.subscribe(
      (dataSetFeedback: DataSetFeedback) => this.processDataSetFeedback(
        dataSetFeedback
      )
    );
  }
  ngOnDestroy() {
    this.cancelSubs();
  }

  private cancelSubs() : void {
    this.subDataSetFeedback.unsubscribe();
  }
  public onSearchBoxNotSuccess(prop: string) : void {
    this.hasNotSuccessEmitter.emit(prop);
  }
  public onSearchBoxSuccess(info: Object) : void {
    this.hasSuccessEmitter.emit(info);
  }
  private processDataSetFeedback(dataSetFeedback : DataSetFeedback) : void {
    let promise : Promise<any> = new Promise(
      (resolve, reject) => resolve(dataSetFeedback)
    );
    promise.then((dataSetFeedback: DataSetFeedback) => {
      let property: string = dataSetFeedback.prop;
      let value: string = dataSetFeedback.val;
      if (this.dataSetFeedbackWasReset(dataSetFeedback)) {
        // this.currentDataSet.resetProps();
        this.currentDataSet = new DataSet();
        this.resetDataSetSrcBloodhoundSrc();
      }
      switch (property) {
        case 'Field':
          // this.currentDataSet.resetProps();
          this.currentDataSet = new DataSet();
          this.resetDataSetSrcBloodhoundSrc();
          if (value) {
            this.setFilteredDataSetSrcBloodhoundSrc('Ticker', 'Field', value);
            this.currentDataSet.Field = value;
          }
          break;
        case 'Ticker':
          this.currentDataSetSrcId = null;
          let fieldValue: string = this.currentDataSet.Field;
          if (fieldValue && value) {
            this.currentDataSet.Ticker = value;
            this.getDataSetSrcFromTickerField(value, fieldValue).then(
              (dataSetSrc: DataSetSrc): void => {
                this.currentDataSet.DataPoints = dataSetSrc.DataPoints;
                this.currentDataSetSrcId = dataSetSrc.Id;
              }
            );
          }
          break;
      }
    });
  }
}
