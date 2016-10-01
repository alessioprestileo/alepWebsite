import { NgModule }           from '@angular/core';

import { RadioInputComponent } from "./radio-input.component";
import { SharedModule } from "../../shared.module";


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    RadioInputComponent,
  ],
  exports: [
    RadioInputComponent,
  ],
  providers: [ ]
})
export class RadioInputModule { }
