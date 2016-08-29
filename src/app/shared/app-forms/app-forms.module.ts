import { NgModule }           from '@angular/core';

import { ChartFormModule } from "./chart-form/chart-form.module";
import { InputBoxModule } from "./input-box/input-box.module";
import { SearchBoxModule } from "./search-box/search-box.module";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  imports:      [ ChartFormModule, InputBoxModule, SearchBoxModule,
                  SharedModule ],
  declarations: [ ],
  exports:      [ ChartFormModule, InputBoxModule, SearchBoxModule ],
  providers:    [ ]
})
export class AppFormsModule { }
