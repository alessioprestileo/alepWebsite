// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { ServerData }               	 from './shared/utils/server-data';

// Angular modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule }     from '@angular/http';

// App imports
import { AppComponent }  from './app.component';
import { AppRoutingService } from './shared/services/app-routing.service';
import { ROUTING, ROUTES_DICT }        from './app.routing';
import { ServerService } from './shared/services/server.service';

import { LabComponent } from './routes/lab/lab.component'
import { NewChartComponent } from './routes/new-chart/new-chart.component'
import { SamplesComponent } from './routes/samples/samples.component'
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';

@NgModule({
  imports: [
    BrowserModule,
    // FormsModule,
    // ReactiveFormsModule,
    ROUTING,
    HttpModule,

    // NavigationModule,
    // RoutesModule,
    // SharedModule,
    // ShowChartModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppRoutingService,
    ServerService,
    {provide: 'ROUTES_DICT', useValue: ROUTES_DICT},
    { provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
    { provide: SEED_DATA,  useClass: ServerData }     // in-mem server data
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}
