import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Observable } from "rxjs/Rx";

@Component({
  // moduleId: module.id,
  selector: 'app-fluid-buttons',
  templateUrl: 'fluid-buttons.component.html',
  styleUrls: ['fluid-buttons.component.css']
})
export class FluidButtonsComponent implements OnInit {
  @Input() buttonType: string;
  @Input() inLabels: string[];
  @Input() btnsPerRow: number;
  @Input() columnsPerBtn: number;
  @Input() selectedLabel: Observable<string>;
  @Output() selectedEmitter = new EventEmitter();

  private labels : Array<string[]>;
  private styleColumnClass: string;
  private styleColumnClassOffset: string;
  private columnOffset: number;

  constructor() {}

  ngOnInit() {
    this.styleColumnClass = 'col-sm-'+ this.columnsPerBtn;
    this.columnOffset = (12 - (this.columnsPerBtn * this.btnsPerRow)) / 2;
    this.styleColumnClassOffset = this.styleColumnClass +
        ' col-sm-offset-' + this.columnOffset;
    this.labels = this.arrangeBtns(this.inLabels);
  }

  private arrangeBtns(inLabels: string[]) : Array<string[]> {
    let btnsNum = inLabels.length;
    let rowsNum = Math.ceil(btnsNum / this.btnsPerRow);
    let labels = new Array<string[]>(rowsNum);
    for (let i = 0; i < rowsNum; i++) {
      let start = this.btnsPerRow * i;
      labels[i] = inLabels.slice(start, start + this.btnsPerRow);
    }
    return labels;
  }
  public onSelected(label: string) : void {
    this.selectedEmitter.emit(label);
  }
}
