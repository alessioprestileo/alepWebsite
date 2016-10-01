import { NgModule }           from '@angular/core';

import { DepartmentsComponent } from "./departments.component";
import { NavigationModule } from "../../../../../shared/navigation/navigation.module";
import { SharedModule } from "../../../../../shared/shared.module";


@NgModule({
  imports: [
    NavigationModule,
    SharedModule
  ],
  declarations: [
    DepartmentsComponent
  ],
  exports: [
    DepartmentsComponent
  ],
  providers: [ ]
})
export class DepartmentsModule { }
