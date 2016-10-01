import { NgModule }           from '@angular/core';

import { DataTableModule } from "../../../../../../shared/data-table/data-table.module";
import { UserChartsComponent } from './user-charts.component';
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    DataTableModule, SharedModule
  ],
  declarations: [
    UserChartsComponent
  ],
  exports: [
    UserChartsComponent
  ],
  providers:    [ ]
})
export class UserChartsModule { }
