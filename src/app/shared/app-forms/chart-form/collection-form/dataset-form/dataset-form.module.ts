import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgModule }           from '@angular/core';

import { DataSetFormComponent } from "./dataset-form.component";
import { SearchBoxModule } from "../../../search-box/search-box.module";
import { SharedModule } from "../../../../shared.module";


@NgModule({
  imports:      [
    FormsModule, ReactiveFormsModule,
    SearchBoxModule,
                  SharedModule ],
  declarations: [ DataSetFormComponent ],
  exports:      [ DataSetFormComponent ],
  providers:    [ ]
})
export class DataSetFormModule { }
