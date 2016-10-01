import { NgModule }           from '@angular/core';

import { NavigationModule } from "../../../../shared/navigation/navigation.module";
import { SharedModule } from "../../../../shared/shared.module";
import {WarehouseNavComponent} from "./warehouse-nav.component";

@NgModule({
  imports: [
    NavigationModule,
    SharedModule
  ],
  declarations: [
    WarehouseNavComponent
  ],
  exports: [
    WarehouseNavComponent
  ],
  providers: [ ]
})
export class WarehouseNavModule { }
