import { NgModule }           from '@angular/core';

import { CarouselModule } from "../../shared/carousel/carousel.module";
import { ProjectsComponent } from "./projects.component";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  imports: [
    CarouselModule, SharedModule
  ],
  declarations: [
    ProjectsComponent
  ],
  exports: [
    ProjectsComponent
  ],
  providers: [ ]
})
export class ProjectsModule { }
