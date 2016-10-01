import { NgModule }           from '@angular/core';

import { DepartmentDetailComponent } from "./department-detail.component";
import { ProductsModule } from "../products/products.module";
import { SharedModule } from "../../../../../shared/shared.module";


@NgModule({
  imports: [
    ProductsModule,
    SharedModule
  ],
  declarations: [
    DepartmentDetailComponent
  ],
  exports: [
    DepartmentDetailComponent
  ],
  providers: [ ]
})
export class DepartmentDetailModule { }
