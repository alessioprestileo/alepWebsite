// Angular-CLI build configuration
// This file lists all the node_modules files that will be used in a build
// Also see https://github.com/angular/angular-cli/wiki/3rd-party-libs

/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/**/*.+(js|js.map)',
      'es6-shim/es6-shim.js',
      'reflect-metadata/**/*.+(ts|js|js.map)',
      'rxjs/**/*.+(js|js.map)',
      '@angular/**/*.+(js|js.map)',
      'angular2-in-memory-web-api/**/*.+(js|js.map)',
      'angular2-datatable/datatable.js',
      'angular2-datatable/lib/*.js',
      'bootstrap/dist/js/bootstrap.min.js',
      'bootstrap/dist/fonts/*.+(woff|woff2)',
      'bootstrap/dist/css/bootstrap.min.css',
      'bootstrap/dist/css/bootstrap-theme.min.css',
      'chart.js/dist/Chart.bundle.min.js',
      'chart.js/dist/Chart.min.js',
      'jquery/dist/core.js',
      'jquery/dist/jquery.min.js',
      'lodash/**/*.+(js|js.map)',
      'ng2-charts/ng2-charts.js',
      'ng2-charts/components/charts/charts.js',
      'typeahead.js/dist/typeahead.bundle.min.js'
    ]
  });
};
