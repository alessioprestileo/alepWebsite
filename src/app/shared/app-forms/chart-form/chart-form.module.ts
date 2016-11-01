import {NgModule}           from '@angular/core';

// import { AlepNg2ChartModule } from 'alep-ng2-chart/dist/index';
import { AlepNg2ChartModule } from '../../prova/alep-ng2-chart.module';
import { AlepNg2ChartD3Module } from '../../prova_d3/alep-ng2-chart_d3.module';

import { ChartFormComponent } from "./chart-form.component";
import { CollectionFormModule } from "./collection-form/collection-form.module";
import { InputBoxModule } from "../input-box/input-box.module";
import { SharedModule } from "../../shared.module";

@NgModule({
  imports: [
    AlepNg2ChartModule, AlepNg2ChartD3Module, CollectionFormModule, InputBoxModule, SharedModule
  ],
  declarations: [ ChartFormComponent ],
  exports:      [ ChartFormComponent ],
  providers:    [ ]
})
export class ChartFormModule { }
