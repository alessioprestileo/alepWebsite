// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { InMemoryData }               	 from './shared/utils/in-memory-data';

// Angular modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }     from '@angular/http';

// App routing
import { AlepWebsiteRoutingModule, ROUTES_DICT } from './app-routing.module';
import { ChartDetailModule } from "./routes/projects/charts/routes/chart-detail/chart-detail.module";
import { CollectionDetailModule } from "./routes/projects/charts/routes/collection-detail/collection-detail.module";
import { DashboardModule } from './routes/projects/charts/routes/dashboard/dashboard.module';
import { DepartmentsModule } from './routes/projects/warehouse/routes/departments/departments.module';
import { HomeModule } from './routes/home/home.module';
import { MyCvModule } from './routes/my-cv/my-cv.module';
import { ProductsModule } from './routes/projects/warehouse/routes/products/products.module';
import { ProductDetailModule } from './routes/projects/warehouse/routes/product-detail/product-detail.module';
import { ProjectsModule } from './routes/projects/projects.module';
import { WhoAmIModule } from './routes/who-am-i/who-am-i.module';
// Other app imports
import { AppComponent }  from './app.component';
import { AppRoutingService } from './shared/services/app-routing.service';
import { ChartsNavModule } from "./routes/projects/charts/charts-nav/charts-nav.module";
import { ExternalService } from "./shared/services/external.service";
import { NavigationModule } from "./shared/navigation/navigation.module";
import { SiteMapModule } from "./shared/site-map/site-map.module";
import { UserDataService } from "./shared/services/user-data.service";
import { WarehouseNavModule } from "./routes/projects/warehouse/warehouse-nav/warehouse-nav.module";
import { WarehouseService } from "./shared/services/warehouse.service";
import { WeatherService } from "./shared/services/weather.service";

@NgModule({
  imports: [
    // Angular modules
    BrowserModule,
    HttpModule,
    // ROUTING
    AlepWebsiteRoutingModule,
    // Routes modules
    ChartDetailModule,
    CollectionDetailModule,
    DashboardModule,
    DepartmentsModule,
    HomeModule,
    MyCvModule,
    ProductsModule,
    ProductDetailModule,
    ProjectsModule,
    WhoAmIModule,
    // App modules used directly by AppComponent
    ChartsNavModule,
    NavigationModule,
    SiteMapModule,
    WarehouseNavModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    AppRoutingService,
    ExternalService,
    UserDataService,
    WarehouseService,
    WeatherService,
    { provide: 'ROUTES_DICT', useValue: ROUTES_DICT },
    { provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
    { provide: SEED_DATA,  useClass: InMemoryData }     // in-mem server data
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}
