import { NgModule }           from '@angular/core';

import { FromIdComponent } from "./from-id.component";
import { SearchBoxModule } from "../../../../../search-box/search-box.module";
import { SharedModule } from "../../../../../../../shared/shared.module";


@NgModule({
  imports: [
    SearchBoxModule, SharedModule
  ],
  declarations: [ FromIdComponent ],
  exports:      [ FromIdComponent ],
  providers:    [ ]
})
export class FromIdModule { }
