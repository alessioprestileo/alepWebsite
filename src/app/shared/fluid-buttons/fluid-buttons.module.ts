import { NgModule }           from '@angular/core';

import { FluidButtonsComponent } from "./fluid-buttons.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    FluidButtonsComponent
  ],
  exports: [
    FluidButtonsComponent
  ],
  providers: [ ]
})
export class FluidButtonsModule { }
