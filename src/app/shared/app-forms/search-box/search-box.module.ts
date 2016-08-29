import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgModule }           from '@angular/core';

import { SearchBoxComponent } from "./search-box.component";
import { SharedModule } from "../../shared.module";


@NgModule({
  imports:      [
    FormsModule, ReactiveFormsModule,
    SharedModule ],
  declarations: [ SearchBoxComponent ],
  exports:      [ SearchBoxComponent ],
  providers:    [ ]
})
export class SearchBoxModule { }
