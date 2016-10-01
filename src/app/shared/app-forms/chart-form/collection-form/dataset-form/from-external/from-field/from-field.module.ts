import { NgModule }           from '@angular/core';

import { FromFieldComponent } from "./from-field.component";
import { SearchBoxModule } from "../../../../../search-box/search-box.module";
import { SharedModule } from "../../../../../../../shared/shared.module";


@NgModule({
  imports: [
    SearchBoxModule, SharedModule
  ],
  declarations: [ FromFieldComponent ],
  exports:      [ FromFieldComponent ],
  providers:    [ ]
})
export class FromFieldModule { }
