import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormGroup } from "@angular/forms";

import {BehaviorSubject, Subscription }   from 'rxjs/Rx';

import { DataSet } from "../../../../../../models/DataSet";
import { DataSetSrc_External } from "../../../../../../models/DataSetSrc_External";
import { DataSetFeedback } from "../../../../../../models/DataSetFeedback";
import { DataSetBasicHandler } from "../../DataSetBasicHandler";
import { ExternalService } from "../../../../../../services/external.service";
import { SearchBoxComponent } from '../../../../../search-box/search-box.component';

@Component({
  moduleId: module.id,
  selector: 'app-from-id',
  templateUrl: 'from-id.component.html',
  styleUrls: ['from-id.component.css'],
  directives: [SearchBoxComponent]
})
export class FromIdComponent
extends DataSetBasicHandler
implements OnInit, OnDestroy {
  @Input() protected currentDataSet: DataSet;
  @Input() protected dataSetSrcBloodhoundSrcs: any;
  @Input() private inFormGroup: FormGroup;
  @Input() protected obDataSetFeedback: BehaviorSubject<DataSetFeedback>;
  @Output() private emHasNotSuccess = new EventEmitter();
  @Output() private emHasSuccess = new EventEmitter();
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
    this.emHasNotSuccess.emit(prop);
  }
  public onSearchBoxSuccess(info: Object) : void {
    this.emHasSuccess.emit(info);
  }
  private processDataSetFeedback(dataSetFeedback : DataSetFeedback) : void {
    let promise : Promise<any> = new Promise(
      (resolve, reject) => resolve(dataSetFeedback)
    );
    promise.then((dataSetFeedback: DataSetFeedback) => {
      let property: string = dataSetFeedback.prop;
      let value: string = dataSetFeedback.val;
      if (this.dataSetFeedbackWasReset(dataSetFeedback)) {
        this.currentDataSet.resetProps();
        this.resetDataSetSrcBloodhoundSrc();
      }
      this.currentDataSet.resetProps();
      this.resetDataSetSrcBloodhoundSrc();
      if (property === 'Id' && value) {
        this.externalService.getDataSetSrc(value).then(
          (dataSetSrc: DataSetSrc_External) : void => {
            this.currentDataSet.dataPoints = dataSetSrc.DataPoints;
            this.currentDataSet.field = dataSetSrc.Field;
            this.currentDataSetSrcId = dataSetSrc.Id;
            this.currentDataSet.ticker = dataSetSrc.Ticker;
          }
        );
      }
    });
  }
}
