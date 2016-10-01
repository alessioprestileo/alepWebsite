import { NgModule }           from '@angular/core';

import { DataTableModule } from "../../../../../../shared/data-table/data-table.module";
import { UserCollectionsComponent } from './user-collections.component';
import { SharedModule } from "../../../../../../shared/shared.module";

@NgModule({
  imports: [
    DataTableModule, SharedModule
  ],
  declarations: [
    UserCollectionsComponent
  ],
  exports: [
    UserCollectionsComponent
  ],
  providers:    [ ]
})
export class UserCollectionsModule { }
