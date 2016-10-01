import { NgModule }           from '@angular/core';

import { FromTickerComponent } from "./from-ticker.component";
import { SearchBoxModule } from "../../../../../search-box/search-box.module";
import { SharedModule } from "../../../../../../../shared/shared.module";


@NgModule({
  imports: [
    SearchBoxModule, SharedModule
  ],
  declarations: [ FromTickerComponent ],
  exports:      [ FromTickerComponent ],
  providers:    [ ]
})
export class FromTickerModule { }
