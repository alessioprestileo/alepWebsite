import { NgModule }           from '@angular/core';

import { SharedModule } from "../shared.module";
import { CarouselComponent } from './carousel.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    CarouselComponent
  ],
  exports: [
    CarouselComponent
  ],
  providers: [ ]
})
export class CarouselModule { }
