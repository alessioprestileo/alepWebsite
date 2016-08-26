import { enableProdMode } from '@angular/core';
import { environment } from './app/';

// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// The app module
import { AppModule } from './app/app.module';

// Check for production mode
if (environment.production) {
  enableProdMode();
}
// Bootstrap the AppModule
platformBrowserDynamic().bootstrapModule(AppModule);

