import { NgModule }           from '@angular/core';

import { CollectionFormModule } from "../../../../../shared/app-forms/chart-form/collection-form/collection-form.module";
import { InputBoxModule } from "../../../../../shared/app-forms/input-box/input-box.module";
import { CollectionDetailComponent } from "./collection-detail.component";
import { SharedModule } from "../../../../../shared/shared.module";

@NgModule({
  imports: [
    CollectionFormModule, InputBoxModule, SharedModule
  ],
  declarations: [
    CollectionDetailComponent
  ],
  exports: [
    CollectionDetailComponent
  ],
  providers:    [ ]
})
export class CollectionDetailModule { }
