import { NgModule }           from '@angular/core';

import { DataSetFormComponent } from "./dataset-form.component";
import { FromWeatherDataModule } from "./from-weather-data/from-weather-data.module";
import { FromUserDataModule } from "./from-user-data/from-user-data.module";
import { SharedModule } from "../../../../shared.module";


@NgModule({
  imports: [
    FromWeatherDataModule, FromUserDataModule, SharedModule
  ],
  declarations: [ DataSetFormComponent ],
  exports:      [ DataSetFormComponent ],
  providers:    [ ]
})
export class DataSetFormModule { }
