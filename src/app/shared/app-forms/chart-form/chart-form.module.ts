import {NgModule}           from '@angular/core';

import { ChartFormComponent } from "./chart-form.component";
import { CollectionFormModule } from "./collection-form/collection-form.module";
import { InputBoxModule } from "../input-box/input-box.module";
import { SharedModule } from "../../shared.module";
import { ShowChartModule } from "../../show-chart/show-chart.module";

@NgModule({
  imports: [
    CollectionFormModule, InputBoxModule, SharedModule, ShowChartModule
  ],
  declarations: [ ChartFormComponent ],
  exports:      [ ChartFormComponent ],
  providers:    [ ]
})
export class ChartFormModule { }
