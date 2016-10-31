import { NgModule }           from '@angular/core';

import { AlepNg2ChartModule } from 'alep-ng2-chart/dist/index';
import { SamplesComponent }   from './samples.component';
import { SharedModule } from "../../../../../shared/shared.module";


@NgModule({
  imports: [
    AlepNg2ChartModule,
    SharedModule
  ],
  declarations: [
    SamplesComponent
  ],
  exports: [
    SamplesComponent
  ],
  providers: [ ]
})
export class SamplesModule { }
