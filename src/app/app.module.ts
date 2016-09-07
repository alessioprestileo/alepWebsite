// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { ServerData }               	 from './shared/utils/server-data';

// Angular modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }     from '@angular/http';

// App imports
import { AppComponent }  from './app.component';
import { AppRoutingService } from './shared/services/app-routing.service';
import { ROUTING, ROUTES_DICT }        from './app.routing';
import { ServerService } from './shared/services/server.service';

@NgModule({
  imports: [
    BrowserModule,
    ROUTING,
    HttpModule,
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
