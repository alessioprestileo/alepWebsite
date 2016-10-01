import { NgModule }           from '@angular/core';

import { SharedModule } from "../../shared/shared.module";
import { SiteMapComponent } from "./site-map.component";


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    SiteMapComponent
  ],
  exports: [
    SiteMapComponent
  ],
  providers: [ ]
})
export class SiteMapModule { }
