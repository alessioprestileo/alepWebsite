import { NgModule }           from '@angular/core';

import { ROUTING } from "./lab.routing";
import { SharedModule } from "../../shared/shared.module";
import { LabComponent } from './lab.component';

@NgModule({
  imports:      [ ROUTING, SharedModule ],
  declarations: [ LabComponent ],
  exports:      [ LabComponent ],
  providers:    [ ]
})
export class LabModule { }
