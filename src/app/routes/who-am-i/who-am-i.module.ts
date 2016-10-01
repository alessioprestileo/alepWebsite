import { NgModule }           from '@angular/core';

import { WhoAmIComponent } from "./who-am-i.component";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    WhoAmIComponent
  ],
  exports: [
    WhoAmIComponent
  ],
  providers:    [ ]
})
export class WhoAmIModule { }
