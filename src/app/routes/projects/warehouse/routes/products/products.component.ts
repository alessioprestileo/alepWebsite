import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription }   from 'rxjs/Rx';

import { Product } from '../shared/models/product';
import { HeaderEntry, TableInput } from '../shared/models/table-input';
import { DataTableComponent } from '../data-table/data-table.component';
import { ServerService } from '../shared/services/server.service';
import { AppRoutingService } from '../shared/services/app-routing.service';

@Component({
  moduleId: module.id,
  selector: 'app-products',
  templateUrl: 'products.component.html',
  styleUrls: ['products.component.css'],
  directives: [DataTableComponent]
})
export class ProductsComponent implements OnInit, OnDestroy {
  private subUrlLevel1: Subscription;
  private subUrlLevel2: Subscription;
  private section: string;
  private depId: string;
  private isInDOM: boolean;
  private products: Product[];
  private error: any;
  private title: string;
  private windowWidth: number;
  private wasMobile: boolean;
  private isMobile: boolean;
  private tableInput: TableInput;

  constructor(
      @Inject('ROUTES_DICT') private ROUTES_DICT,
      private appRoutingService: AppRoutingService,
      private serverService: ServerService) {}

  ngOnInit() {
    this.subUrlLevel1 = this.appRoutingService.currentUrlLevel1.subscribe(
      (section: string) => this.section = section);
    this.subUrlLevel2 = this.appRoutingService.currentUrlLevel2.subscribe(
      (res: string) => {
        this.depId = ((this.section === this.ROUTES_DICT.departments) &&
          (res !== this.ROUTES_DICT.all)) ? res : null;
        this.isInDOM = ((this.section === this.ROUTES_DICT.products) ||
          (this.depId)) ? true : false;
        if (this.isInDOM) {
          this.setTitle();
          this.getProducts().then((prods:Product[]) => {
            this.products = prods;
            this.onResize();
            this.buildTableInput(this.isMobile);
            }
          );
        }
      }
    );
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subUrlLevel1.unsubscribe();
    this.subUrlLevel2.unsubscribe();
  }

  private buildTableInput(isMobile: boolean) : void {
    let headers: Array<HeaderEntry>;
    if (isMobile) {
      headers = [
        new HeaderEntry('Id', 'id'),
        new HeaderEntry('Name', 'editables.name')
      ];
    } else {
      headers = [
        new HeaderEntry('Id', 'id'),
        new HeaderEntry('Name', 'editables.name'),
        new HeaderEntry('Department', 'editables.department'),
        new HeaderEntry('Price', 'editables.price')
      ];
    }
    this.tableInput = new TableInput(headers, this.products);
  }
  private onResize() : void {
    this.windowWidth = window.innerWidth;
    this.isMobile = (this.windowWidth < 768) ? true : false;
    if (this.wasMobile !== this.isMobile) {
      if (typeof this.wasMobile !== 'undefined') {
        this.buildTableInput(this.isMobile);
      }
      this.wasMobile = this.isMobile;
    }
  }
  private getProducts() : Promise<Product[]> {
    if (this.depId) {
      return this.serverService.getProducts()
        .then(products => products.filter(p => p.editables.department
        === this.depId));
    } else {
      return this.serverService.getProducts();
    }
  }
  public addProduct() : void {
    let link: string[] = [this.ROUTES_DICT.products + '/' +
      this.ROUTES_DICT.detail, this.ROUTES_DICT.new];
    this.appRoutingService.navigate(link);
  }
  private setTitle() : void {
    if (this.depId) {
      this.title = 'All products in department: ' + this.depId;
    } else {
      this.title = 'All products';
    }
  }
  public editProduct(product: Product) : void {
    let link: string[] = [this.ROUTES_DICT.products + '/' +
      this.ROUTES_DICT.detail, product.id.toString()];
    this.appRoutingService.navigate(link);
  }
  public removeProduct(product: Product) : void {
    this.serverService.delete(product)
        .then(() => {
            this.products = this.products.filter(p => p !== product);
            this.updateTableInput();
          })
        .catch(error => this.error = error);
  }
  private updateTableInput() : void {
    this.tableInput.setObjects(this.products);
  }
}
