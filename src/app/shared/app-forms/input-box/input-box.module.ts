import { ReactiveFormsModule }   from '@angular/forms';
import { NgModule }           from '@angular/core';

import { InputBoxComponent } from "./input-box.component";
import { AlepNg2InputBoxModule } from "alep-ng2-input-box";
import { SharedModule } from "../../shared.module";


@NgModule({
  imports: [
    AlepNg2InputBoxModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    InputBoxComponent
  ],
  exports: [
    InputBoxComponent
  ],
  providers:    [ ]
})
export class InputBoxModule { }
