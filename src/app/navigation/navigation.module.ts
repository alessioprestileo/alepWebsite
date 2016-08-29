import { NgModule }           from '@angular/core';

import { SharedModule } from "../shared/shared.module";
import { NavigationComponent } from './navigation.component';

@NgModule({
  imports:      [ SharedModule ],
  declarations: [ NavigationComponent ],
  exports:      [ NavigationComponent ],
  providers:    [ ]
})
export class NavigationModule { }
