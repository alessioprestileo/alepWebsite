import {
  AfterViewChecked, Component, Inject, OnInit, OnDestroy
} from '@angular/core';
import { Location }    from '@angular/common';
import {
  REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, ValidatorFn
} from '@angular/forms';

import { BehaviorSubject, Subscription } from 'rxjs/Rx';

import { formGroupValidator } from '../../../../../shared/app-forms/formGroup.validator';
import { InputBoxComponent } from "../../../../../shared/app-forms/input-box/input-box.component";
import { ProductFormComponent } from "../../../../../shared/app-forms/product-form/product-form.component";
import { WarehouseProd }        from '../../../../../shared/models/WarehouseProd';
import { WarehouseProdSrc } from "../../../../../shared/models/warehouseProdSrc";
import { WarehouseService } from '../../../../../shared/services/warehouse.service';

@Component({
  moduleId: module.id,
  selector: 'app-product-detail',
  templateUrl: 'product-detail.component.html',
  styleUrls: ['product-detail.component.css'],
  directives: [InputBoxComponent, ProductFormComponent, REACTIVE_FORM_DIRECTIVES]
})
export class ProductDetailComponent implements AfterViewChecked, OnDestroy, OnInit {
  private formGroup: FormGroup;
  private formGroupValidator: ValidatorFn = formGroupValidator;
  private newProd: boolean = false;
  private obFormGroupValid: BehaviorSubject<boolean>;
  private prodIdKeyword: string;
  private prevBrowserPath: string;
  private prodIsReady: boolean;
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
    this.createFormGroup();
    this.createObsAndSubs();
  }
  ngOnDestroy() {
    this.cancelSubs();
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

  private cancelSubs() : void {
    this.subFormGroupValid.unsubscribe();
  }
  private createFormGroup() : void {
    this.formGroup = new FormGroup({}, null, this.formGroupValidator);
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
  private priceValidator(control: FormControl) :
      {[s: string]: boolean} {
    if (!control.value.match(/^[0-9]+\.[0-9]{2}$/)) {
      return {invalidPrice: true};
    }
  }
  public onSave() : void {
    this.warehouseService
      // onSave product, id given by the server
      .saveItem('products', this.product)
      .then(() => this.onGoBack());
  }
  private setIdKeyword(url: string) : void {
    let split: string[] = url.split('/');
    this.prodIdKeyword = split[split.length - 1];
  }
  private setProd() : Promise<any> {
    this.prodIsReady = false;
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
          this.warehouseService.importProdPropsFromProdSrc(
            this.product, prodSrc
          ).then(() => this.prodIsReady = true);
        });
    }
  }
  private setTitle() : void {
    this.title = (this.prodIdKeyword === 'New') ?
      'Insert data for the new product' :
      'Edit data for the product "' + this.product.name + '"';
  }
}
