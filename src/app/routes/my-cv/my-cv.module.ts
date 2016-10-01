import { NgModule }           from '@angular/core';

import { MyCvComponent } from "./my-cv.component";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    MyCvComponent
  ],
  exports: [
    MyCvComponent
  ],
  providers:    [ ]
})
export class MyCvModule { }
