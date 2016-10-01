import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { TableInput } from "../models/table-input-classes";

@Component({
  // moduleId: module.id,
  selector: 'app-data-table',
  templateUrl: 'data-table.component.html',
})

export class DataTableComponent {
  @Input() private tableInput: TableInput;
  @Output() private editEmitter = new EventEmitter();
  @Output() private removeEmitter = new EventEmitter();

  constructor() {
  }

  public getPropertyValue(item: any, propName: string) : any {
    let splitPropName = propName.split('.');
    let result: any;
    if (splitPropName.length === 1) {
      result = item[splitPropName[0]];
    }
    else if (splitPropName.length === 2) {
      result = item[splitPropName[0]][splitPropName[1]];
    }
    else {
      result = "Error: Can't get value";
    }
    result = (((typeof(result)).toLowerCase() === 'number')
             && propName.includes('price')) ? result.toFixed(2) : result;
    return result;
  }
  public editItem(item: any) : void {
    this.editEmitter.emit(item);
  }
  public removeItem(item: any) : void {
    this.removeEmitter.emit(item);
  }
}
