import { NgModule }           from '@angular/core';

import { FromWeatherDataComponent } from "./from-weather-data.component";
import { InputBoxModule } from "../../../../input-box/input-box.module";
import { SharedModule } from "../../../../../shared.module";


@NgModule({
  imports: [
    InputBoxModule, SharedModule
  ],
  declarations: [ FromWeatherDataComponent ],
  exports:      [ FromWeatherDataComponent ],
  providers:    [ ]
})
export class FromWeatherDataModule {}
