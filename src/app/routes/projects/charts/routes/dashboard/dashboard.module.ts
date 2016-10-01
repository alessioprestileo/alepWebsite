import { NgModule }           from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { SharedModule } from "../../../../../shared/shared.module";
import { UserChartsModule } from './user-charts/user-charts-module';
import { UserCollectionsModule } from './user-collections/user-collections.module';

@NgModule({
  imports: [
    SharedModule, UserChartsModule, UserCollectionsModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ],
  providers:    [ ]
})
export class DashboardModule { }
