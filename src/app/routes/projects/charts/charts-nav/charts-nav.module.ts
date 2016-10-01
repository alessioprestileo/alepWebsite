import { NgModule }           from '@angular/core';

import { NavigationModule } from "../../../../shared/navigation/navigation.module";
import { ChartsNavComponent } from "./charts-nav.component";
import { SharedModule } from "../../../../shared/shared.module";

@NgModule({
  imports: [
    NavigationModule, SharedModule
  ],
  declarations: [
    ChartsNavComponent
  ],
  exports: [
    ChartsNavComponent
  ],
  providers:    [ ]
})
export class ChartsNavModule { }
