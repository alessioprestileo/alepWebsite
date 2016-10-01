import { NgModule }           from '@angular/core';

import { FromExternalComponent } from "./from-external.component";
import { FromFieldModule } from "./from-field/from-field.module";
import { FromIdModule } from "./from-id/from-id.module";
import { FromTickerModule } from "./from-ticker/from-ticker.module";
import { RadioInputModule } from "../../../../radio-input/radio-input.module";
import { SharedModule } from "../../../../../shared.module";


@NgModule({
  imports:      [
    FromFieldModule, FromIdModule, FromTickerModule, RadioInputModule,
    SharedModule ],
  declarations: [ FromExternalComponent ],
  exports:      [ FromExternalComponent ],
  providers:    [ ]
})
export class FromExternalModule {}
