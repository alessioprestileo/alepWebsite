import { NgModule }           from '@angular/core';

import { DataTableModule } from "../../../../../shared/data-table/data-table.module";
import { ProductsComponent } from "./products.component";
import { SharedModule } from "../../../../../shared/shared.module";


@NgModule({
  imports: [
    DataTableModule,
    SharedModule
  ],
  declarations: [
    ProductsComponent
  ],
  exports: [
    ProductsComponent
  ],
  providers: [ ]
})
export class ProductsModule { }
