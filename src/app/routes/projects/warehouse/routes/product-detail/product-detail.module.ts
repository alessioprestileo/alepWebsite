import { NgModule }           from '@angular/core';

import { InputBoxModule } from "../../../../../shared/app-forms/input-box/input-box.module";
import { ProductDetailComponent } from "./product-detail.component";
import { ProductFormModule } from "../../../../../shared/app-forms/product-form/product-form.module";
import { SharedModule } from "../../../../../shared/shared.module";


@NgModule({
  imports: [
    InputBoxModule,
    ProductFormModule,
    SharedModule
  ],
  declarations: [
    ProductDetailComponent
  ],
  exports: [
    ProductDetailComponent
  ],
  providers: [ ]
})
export class ProductDetailModule { }
