import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgModule }           from '@angular/core';

import { DataSetFormModule } from "./dataset-form/dataset-form.module";
import { CollectionFormComponent } from "./collection-form.component";
import { InputBoxModule } from "../../input-box/input-box.module";
import { SharedModule } from "../../../shared.module";


@NgModule({
  imports:      [ DataSetFormModule,
    FormsModule,
    InputBoxModule,
                  ReactiveFormsModule,
    SharedModule ],
  declarations: [ CollectionFormComponent ],
  exports:      [ CollectionFormComponent ],
  providers:    [ ]
})
export class CollectionFormModule { }
