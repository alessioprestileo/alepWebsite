import {
  AfterViewChecked, Component, DoCheck, Inject, OnInit, OnDestroy
} from '@angular/core';
import { Location }    from '@angular/common';
import {
  FormGroup, ValidatorFn
} from '@angular/forms';

import { BehaviorSubject, Subscription } from 'rxjs/Rx';

import { formGroupValidator } from '../../../../../shared/app-forms/formGroup.validator';
import { WarehouseProd }        from '../../../../../shared/models/WarehouseProd';
import { WarehouseProdSrc } from "../../../../../shared/models/WarehouseProdSrc";
import { WarehouseService } from '../../../../../shared/services/warehouse.service';
import {WarehouseDepSrc} from "../../../../../shared/models/WarehouseDepSrc";

declare var jQuery: any;

@Component({
  // moduleId: module.id,
  selector: 'app-product-detail',
  templateUrl: 'product-detail.component.html',
  styleUrls: ['product-detail.component.css'],
})
export class ProductDetailComponent
implements AfterViewChecked, DoCheck, OnDestroy, OnInit {
  private formGroup: FormGroup;
  private formGroupValidator: ValidatorFn = formGroupValidator;
  private newProd: boolean = false;
  private obFormGroupValid: BehaviorSubject<boolean>;
  private prodIdKeyword: string;
  private prevBrowserPath: string;
  private prodIsReady: boolean = false;
  private product: WarehouseProd;
  private subFormGroupValid: Subscription;
  private title: string;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private location: Location,
    private warehouseService: WarehouseService
  ) {
  }

  ngOnInit() {
    this.setDarkBackground();
    this.createFormGroup();
    this.createObsAndSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
    this.removeDarkBackground();
  }
  ngAfterViewChecked() {
    let browserPath: string = this.location.path();
    if (browserPath && browserPath !== this.prevBrowserPath) {
      this.prevBrowserPath = browserPath;
      this.setIdKeyword(browserPath);
      if (this.prodIdKeyword) {
        this.setProd().then(() => {
          this.setTitle();
        });
      }
    }
  }
  ngDoCheck() {
  }

  private cancelSubs() : void {
    this.subFormGroupValid.unsubscribe();
  }
  private createFormGroup() : void {
    this.formGroup = new FormGroup({}, this.formGroupValidator);
  }
  private createObsAndSubs() : void {
    this.obFormGroupValid = new BehaviorSubject(false);
    this.subFormGroupValid = this.formGroup.valueChanges.subscribe(
      () => this.obFormGroupValid.next(this.formGroup.valid)
    );
  }
  private onGoBack() : void {
    window.history.back();
  }
  public onSave() : void {
    let prod: WarehouseProd = this.product;
    this.warehouseService.getAll('departments').then(
      departments => {
        let deps: WarehouseDepSrc[] = <WarehouseDepSrc[]>departments;
        let invalidPaths: string[] = [];
        let filteredPaths: string[] = prod.hierarchy.filter(path => {
          let result: boolean = false;
          for (let dep of deps) {
            if (path === dep.path) {
              result = true;
            }
          }
          if (result === false) {
            invalidPaths.push(path);
          }
          return result;
        });
        if (invalidPaths.length > 0) {
          let message: string = 'The following paths don\'t match any ' +
            'department:';
          for (let path of invalidPaths) {
            message += '\n' + path;
          }
          alert(message);
        }
        else {
          let prodSrc: WarehouseProdSrc = new WarehouseProdSrc();
          prodSrc.importProdSrcPropsFromProd(this.product);
          this.warehouseService
            // save productSrc, id given by the server
            .saveItem('products', prodSrc)
            .then((item) => {
              let prodId: number = item.id;
              for (let dep of deps) {
                for (let path of prod.hierarchy) {
                  if (
                    dep.path === path &&
                    dep.productsIds.indexOf(prodId) < 0
                  ) {
                    dep.productsIds.push(prodId);
                    this.warehouseService.saveItem('departments', dep);
                  }
                }
              }
              this.onGoBack()
            });
        }
      }
    );
  }
  private removeDarkBackground() {
    jQuery("#app-router-outlet").addClass("backgroundLight");
    jQuery("#app-router-outlet").removeClass("backgroundDark");
  }
  private setDarkBackground() {
    jQuery("#app-router-outlet").addClass("backgroundDark");
    jQuery("#app-router-outlet").removeClass("backgroundLight");
  }
  private setIdKeyword(url: string) : void {
    let split: string[] = url.split('/');
    if (split[split.length - 2] === this.ROUTES_DICT.PRODUCTS_DETAIL) {
      this.prodIdKeyword = split[split.length - 1];
    }
  }
  private setProd() : Promise<void> {
    this.prodIsReady = false;
    if (this.prodIdKeyword) {
      if (this.prodIdKeyword === 'New') {
        this.newProd = true;
        let promise: Promise<any> = new Promise(
          (resolve, reject) => resolve()
        );
        return promise.then(() => {
          this.product = new WarehouseProd();
          this.prodIsReady = true;
        });
      }
      else {
        return this.warehouseService
          .getItem('products', +this.prodIdKeyword).then(product => {
            let prodSrc: WarehouseProdSrc = <WarehouseProdSrc>product;
            this.product = new WarehouseProd();
            this.product.importProdPropsFromProdSrc(prodSrc);
            this.prodIsReady = true;
          });
      }
    }
  }
  private setTitle() : void {
    this.title = (this.prodIdKeyword === 'New') ?
      'Insert data for the new product' :
      'Edit data for the product "' + this.product.name + '"';
  }
}
