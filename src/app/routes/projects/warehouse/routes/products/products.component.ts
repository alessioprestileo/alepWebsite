import {
  AfterViewChecked, Component, DoCheck, EventEmitter, HostListener, Inject, OnDestroy,
  OnInit,
} from '@angular/core';
import { Location }    from '@angular/common';

import { Subscription }   from 'rxjs/Rx';

import { AppRoutingService } from '../../../../../shared/services/app-routing.service';
import { DataTableComponent } from '../../../../../shared/data-table/data-table.component';
import { HeaderEntry, TableInput } from '../../../../../shared/models/table-input-classes';
import { WarehouseDep } from "../../../../../shared/models/WarehouseDep";
import { WarehouseProd } from '../../../../../shared/models/WarehouseProd';
import { WarehouseProdSrc } from "../../../../../shared/models/warehouseProdSrc";
import { WarehouseService } from '../../../../../shared/services/warehouse.service';

declare var jQuery: any;

@Component({
  moduleId: module.id,
  selector: 'app-products',
  templateUrl: 'products.component.html',
  styleUrls: ['products.component.css'],
  directives: [DataTableComponent]
})
export class ProductsComponent
implements AfterViewChecked, DoCheck, OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.emOnResize.emit();
  }
  private depName: string;
  private depPath: string;
  private emOnResize: EventEmitter<any> = new EventEmitter();
  private isMobile: boolean;
  private pathKeywords: string[];
  private prevBrowserPath: string;
  private products: WarehouseProd[] = [];
  private subOnResize: Subscription;
  private tableInput: TableInput;
  private title: string;
  private wasMobile: boolean;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private location: Location,
    private appRoutingService: AppRoutingService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit() {
    this.setDarkBackground();
    this.createSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
    this.removeDarkBackground();
  }
  ngAfterViewChecked() {
    let browserPath: string = this.location.path();
    if (browserPath && browserPath !== this.prevBrowserPath) {
      this.prevBrowserPath = browserPath;

      console.log('browserPath = ', browserPath);

      this.setPathKeywords(browserPath);
      if (this.pathKeywords) {
        this.setProducts().then(
          () => {
            this.setTitle();
          }
        );
      }
    }
  }
  ngDoCheck() {

    console.log('this.products = ', this.products);
    console.log('this.tableInput = ', this.tableInput);

  }

  public addProduct() : void {
    let link: string[] = [
      '/' + this.ROUTES_DICT.PROJECTS +
      '/' + this.ROUTES_DICT.WAREHOUSE +
      '/' + this.ROUTES_DICT.PRODUCTS_DETAIL,
      'New'
    ];
    this.appRoutingService.navigate(link);
  }
  private buildTableInput(isMobile: boolean) : void {

    console.log('CALLED');

    let headers: Array<HeaderEntry>;
    if (isMobile) {
      headers = [
        new HeaderEntry('Id', 'id'),
        new HeaderEntry('Name', 'name')
      ];
    } else {
      headers = [
        new HeaderEntry('Id', 'id'),
        new HeaderEntry('Name', 'name'),
        new HeaderEntry('Price', 'price')
      ];
    }
    this.tableInput = new TableInput(headers, this.products);
  }
  private cancelSubs() : void {
    this.subOnResize.unsubscribe();
  }
  private checkMobileAndBuildTableInput() : void {
    this.isMobile = (window.innerWidth < 768) ? true : false;
    if (this.wasMobile !== this.isMobile) {
      this.buildTableInput(this.isMobile);
      this.wasMobile = this.isMobile;
    }
  }
  private createSubs() {
    this.subOnResize = this.emOnResize.subscribe(
      () => this.checkMobileAndBuildTableInput()
    );
  }
  public editProduct(product: WarehouseProd) : void {
    let link: string[] = [
      '/' + this.ROUTES_DICT.PROJECTS +
      '/' + this.ROUTES_DICT.WAREHOUSE +
      '/' + this.ROUTES_DICT.PRODUCTS_DETAIL,
      product.id.toString()
    ];
    this.appRoutingService.navigate(link);
  }
  private removeDarkBackground() {
    jQuery("#app-router-outlet").addClass("backgroundLight");
    jQuery("#app-router-outlet").removeClass("backgroundDark");
  }
  public removeProduct(product: WarehouseProd) : void {
    this.warehouseService.deleteItem('products', product.id).then(
      () => {
        this.products = this.products.filter(p => p !== product);
        this.updateTableInput();
      }
    );
  }
  private setDarkBackground() {
    jQuery("#app-router-outlet").addClass("backgroundDark");
    jQuery("#app-router-outlet").removeClass("backgroundLight");
  }
  private setPathKeywords(url: string) : void {
    let split: string[] = url.split('/');
    if (split[split.length - 1] ===
      this.ROUTES_DICT.PRODUCTS) {
      this.pathKeywords = [this.ROUTES_DICT.PRODUCTS];
    }
    else {
      let depPathStart: number = split.indexOf(
        this.ROUTES_DICT.DEPARTMENTS_DETAIL
      );
      this.pathKeywords = split.slice(depPathStart);
    }
  }
  private setProducts() : Promise<void> {
    let result: Promise<any>;
    if (
      this.pathKeywords.length === 1 &&
      this.pathKeywords[0] === this.ROUTES_DICT.PRODUCTS
    ) {

      console.log('case 1');

      result = this.warehouseService.getAll('products').then(
        (products) => {
          let src: WarehouseProdSrc[] = <WarehouseProdSrc[]>products;
          let length: number = src.length;
          let counter: number = 0;
          for (let i = 0; i < length; i++) {
            let prod: WarehouseProd = new WarehouseProd();
            this.products.push(prod);
            this.warehouseService.importProdPropsFromProdSrc(
              prod, src[i]
            ).then(
              () => {
                counter ++;
                if (counter === length) {
                  this.checkMobileAndBuildTableInput();
                }
              }
            );
          }
        }
      );
    }
    else if (this.pathKeywords.length > 1) {

      console.log('case 2');

      this.depPath = this.pathKeywords.slice(
        0, this.pathKeywords.length - 1
      ).join('/');
      this.depName = this.pathKeywords[this.pathKeywords.length - 1];
      result = this.warehouseService.getDepFromPath(this.depPath).then(
        (dep: WarehouseDep) => {
          this.products = dep.products;
          this.checkMobileAndBuildTableInput();
        }
      );
    }
    else {
      result = new Promise(
        (resolve, reject) => resolve()
      );
    }
    return result.then(
      () => {}
    );
  }
  private setTitle() : void {
    if (this.depName) {
      this.title = 'All products in department: ' + this.depName;
    } else {
      this.title = 'All products';
    }
  }
  private updateTableInput() : void {
    this.tableInput.items = this.products;
  }
}
