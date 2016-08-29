import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA}           from '@angular/core';

import { ChartFormComponent } from "./chart-form.component";
import { CollectionFormModule } from "./collection-form/collection-form.module";
import { InputBoxModule } from "../input-box/input-box.module";
import { SharedModule } from "../../shared.module";
import { ShowChartModule } from "../../show-chart/show-chart.module";

@NgModule({
  imports:      [
    // CollectionFormModule,
    // FormsModule,
    // InputBoxModule,
    // ReactiveFormsModule,
                  SharedModule,
    ShowChartModule
  ],
  declarations: [ ChartFormComponent ],
  exports:      [ ChartFormComponent ],
  providers:    [ ]
})
export class ChartFormModule { }
