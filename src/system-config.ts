// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
};

/** User packages configuration. */
const packages: any = {
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'angular2-datatable',
  'angular2-in-memory-web-api',
  'bootstrap',
  'chart.js',
  'jquery',
  'lodash',
  'ng2-charts',
  'rxjs',
  'slick-carousel',
  'typeahead.js',
  // App specific barrels.
  'app',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'angular2-in-memory-web-api': 'vendor/angular2-in-memory-web-api',
    'angular2-datatable': 'vendor/angular2-datatable',
    'bootstrap': 'vendor/bootstrap',
    'chart.js': 'vendor/show-chart.js',
    'jquery': 'vendor/jquery',
    'lodash': 'vendor/lodash',
    'ng2-charts': 'vendor/ng2-charts',
    'rxjs': 'vendor/rxjs',
    'slick-carousel': 'vendor/slick-carousel',
    'typeahead.js': 'vendor/typeahead.js',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
