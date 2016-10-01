import { NgModule }           from '@angular/core';

import { FluidButtonsModule } from "../fluid-buttons/fluid-buttons.module";
import { NavigationComponent } from "./navigation.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    FluidButtonsModule,
    SharedModule
  ],
  declarations: [
    NavigationComponent,
  ],
  exports: [
    NavigationComponent,
  ],
  providers: [ ]
})
export class NavigationModule { }
