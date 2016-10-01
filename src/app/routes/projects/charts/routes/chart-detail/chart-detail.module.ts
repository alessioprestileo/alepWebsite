import { NgModule }           from '@angular/core';

import { ChartFormModule } from "../../../../../shared/app-forms/chart-form/chart-form.module";
import { InputBoxModule } from "../../../../../shared/app-forms/input-box/input-box.module";
import { ChartDetailComponent } from "./chart-detail.component";
import { SharedModule } from "../../../../../shared/shared.module";

@NgModule({
  imports: [
    ChartFormModule, InputBoxModule, SharedModule
  ],
  declarations: [
    ChartDetailComponent
  ],
  exports: [
    ChartDetailComponent
  ],
  providers:    [ ]
})
export class ChartDetailModule { }
