import { NgModule }           from '@angular/core';

import { DataTableComponent } from "./data-table.component";
import { SharedModule } from "../../shared/shared.module";
import { DataTableModule as ng2DataTableModule } from "angular2-datatable/index";


@NgModule({
  imports: [
    ng2DataTableModule,
    SharedModule
  ],
  declarations: [
    DataTableComponent
  ],
  exports: [
    DataTableComponent
  ],
  providers: [ ]
})
export class DataTableModule { }
