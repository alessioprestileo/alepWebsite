import { NgModule }           from '@angular/core';

import { InputBoxModule } from "../input-box/input-box.module";
import { ProductFormComponent } from "./product-form.component";
import { SharedModule } from "../../shared.module";



@NgModule({
  imports: [
    InputBoxModule,
    SharedModule
  ],
  declarations: [
    ProductFormComponent
  ],
  exports: [
    ProductFormComponent
  ],
  providers: [ ]
})
export class ProductFormModule { }
