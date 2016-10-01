import { NgModule }           from '@angular/core';

import { FromUserDataComponent } from "./from-user-data.component";
import { SharedModule } from "../../../../../shared.module";


@NgModule({
  imports:      [
    SharedModule
  ],
  declarations: [ FromUserDataComponent ],
  exports:      [ FromUserDataComponent ],
  providers:    [ ]
})
export class FromUserDataModule {}
