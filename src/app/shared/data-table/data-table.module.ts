import { NgModule }           from '@angular/core';

import { DataTableComponent } from "./data-table.component";
import { SharedModule } from "../../shared/shared.module";
import { DataTableDirectives } from "angular2-datatable/datatable";


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DataTableDirectives,
    DataTableComponent
  ],
  exports: [
    DataTableComponent
  ],
  providers: [ ]
})
export class DataTableModule { }
