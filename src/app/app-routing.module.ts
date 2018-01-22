import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as ROUTING_LABELS from './app-routing-labels'

import { ChartDetailComponent } from "./routes/projects/charts/routes/chart-detail/chart-detail.component";
import { CollectionDetailComponent } from "./routes/projects/charts/routes/collection-detail/collection-detail.component";
import { DashboardComponent } from './routes/projects/charts/routes/dashboard/dashboard.component';
import { SamplesComponent } from './routes/projects/charts/routes/samples/samples.component';
import { DepartmentsComponent } from './routes/projects/warehouse/routes/departments/departments.component';
import { HomeComponent } from './routes/home/home.component';
import { MyCvComponent } from './routes/my-cv/my-cv.component';
import { ProductsComponent } from './routes/projects/warehouse/routes/products/products.component';
import { ProductDetailComponent } from './routes/projects/warehouse/routes/product-detail/product-detail.component';
import { ProjectsComponent } from './routes/projects/projects.component';
import { WhoAmIComponent } from './routes/who-am-i/who-am-i.component';

export const ROUTES_DICT: {[name: string] : string} = {
  CHARTS: ROUTING_LABELS.CHARTS,
  CHARTS_DETAIL: ROUTING_LABELS.CHART_DETAIL,
  COLLECTIONS_DETAIL: ROUTING_LABELS.COLLECTION_DETAIL,
  DEPARTMENTS: ROUTING_LABELS.DEPARTMENTS,
  DEPARTMENTS_DETAIL: ROUTING_LABELS.DEPARTMENT_DETAIL,
  DASHBOARD: ROUTING_LABELS.DASHBOARD,
  HOME: ROUTING_LABELS.HOME,
  LAB: ROUTING_LABELS.LAB,
  MY_CV: ROUTING_LABELS.MY_CV,
  NEW_CHART: ROUTING_LABELS.NEW_CHART,
  PRODUCTS: ROUTING_LABELS.PRODUCTS,
  PRODUCTS_DETAIL: ROUTING_LABELS.PRODUCT_DETAIL,
  PROJECTS: ROUTING_LABELS.PROJECTS,
  SAMPLES: ROUTING_LABELS.SAMPLES,
  WAREHOUSE: ROUTING_LABELS.WAREHOUSE,
  WHO_AM_I: ROUTING_LABELS.WHO_AM_I,
};

const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: ROUTING_LABELS.HOME,
    pathMatch: 'full'
  },
  {
    path: ROUTING_LABELS.HOME,
    component: HomeComponent
  },
  {
    path: ROUTING_LABELS.MY_CV,
    component: MyCvComponent
  },
  {
    path: ROUTING_LABELS.PROJECTS,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ProjectsComponent,
      },
      {
        path: ROUTING_LABELS.CHARTS,
        children: [
          {
            path: '',
            redirectTo: ROUTING_LABELS.DASHBOARD,
            pathMatch: 'full',
          },
          {
            path: ROUTING_LABELS.DASHBOARD,
            component: DashboardComponent,
          },
          {
            path: ROUTING_LABELS.SAMPLES,
            component: SamplesComponent,
          },
          {
            path: ROUTING_LABELS.CHART_DETAIL,
            children: [
              {
                path: '',
                redirectTo: 'New',
                pathMatch: 'full',
              },
              {
                path: 'New',
                component: ChartDetailComponent,
              },
              {
                path: ':id',
                component: ChartDetailComponent,
              },
            ]
          },
          {
            path: ROUTING_LABELS.COLLECTION_DETAIL,
            children: [
              {
                path: '',
                redirectTo: 'New',
                pathMatch: 'full',
              },
              {
                path: 'New',
                component: CollectionDetailComponent,
              },
              {
                path: ':id',
                component: CollectionDetailComponent,
              },
            ]
          }
        ]
      },
      {
        path: ROUTING_LABELS.WAREHOUSE,
        children: [
          {
            path: '',
            redirectTo: ROUTING_LABELS.DEPARTMENTS,
            pathMatch: 'full',
          },
          {
            path: ROUTING_LABELS.DEPARTMENTS,
            component: DepartmentsComponent
          },
          {
            path: ROUTING_LABELS.DEPARTMENT_DETAIL,
            redirectTo: ROUTING_LABELS.DEPARTMENTS,
            pathMatch: 'full'
          },
          {
            path: ROUTING_LABELS.DEPARTMENT_DETAIL +
              '/' + ':depPath',
            component: ProductsComponent
          },
          {
            path: ROUTING_LABELS.PRODUCTS,
            component: ProductsComponent,
          },
          {
            path: ROUTING_LABELS.PRODUCT_DETAIL,
            children: [
              {
                path: '',
                redirectTo: 'New',
                pathMatch: 'full',
              },
              {
                path: 'New',
                component: ProductDetailComponent,
              },
              {
                path: ':prodId',
                component: ProductDetailComponent,
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: ROUTING_LABELS.WHO_AM_I,
    component: WhoAmIComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule],
  providers: []
})
export class AlepWebsiteRoutingModule { }
