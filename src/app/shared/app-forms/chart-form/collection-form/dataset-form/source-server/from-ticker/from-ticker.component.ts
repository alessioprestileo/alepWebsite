import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { DataSet } from "../../../../../../models/DataSet";
import { SearchBoxComponent } from '../../../../../search-box/search-box.component';


@Component({
  moduleId: module.id,
  selector: 'app-from-ticker',
  templateUrl: 'from-ticker.component.html',
  styleUrls: ['from-ticker.component.css'],
  directives: [SearchBoxComponent]
})
export class FromTickerComponent implements OnInit {
  @Input() private currentDataSet: DataSet;
  @Input() private dataSetSearchSources: any;
  @Input() private inFormGroup: FormGroup;
  @Output() private hasNotSuccessEmitter = new EventEmitter();
  @Output() private hasSuccessEmitter = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  public onSearchBoxNotSuccess(prop: string) : void {
    this.hasNotSuccessEmitter.emit(prop);
  }
  public onSearchBoxSuccess(info: Object) : void {
    this.hasSuccessEmitter.emit(info);
  }
}

