import { ReactiveFormsModule }   from '@angular/forms';
import { NgModule }           from '@angular/core';

import { InputBoxComponent } from "./input-box.component";
import { SharedModule } from "../../shared.module";


@NgModule({
  imports: [
    ReactiveFormsModule, SharedModule
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
