// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { ServerData }               	 from './shared/utils/server-data';

// Angular modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }     from '@angular/http';

// App imports
import { AppComponent }  from './app.component';
import { AppRoutingService } from './shared/services/app-routing.service';
import { NavigationComponent } from './navigation/navigation.component';
import { ROUTING, ROUTES_DICT }        from './app.routing';
import { RoutesModule } from './routes/routes.module'
import { ServerService } from './shared/services/server.service';
import { SharedModule } from './shared/shared.module'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ROUTING,
    HttpModule,

    RoutesModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    NavigationComponent
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
