import { Component, OnInit, OnDestroy } from '@angular/core';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder,
  FormControl, Validators } from '@angular/forms';
import { Subscription }   from 'rxjs/Rx';

import { Router }    from '@angular/router';

import { Product }        from '../shared/models/product';
import { ServerService } from '../shared/services/server.service';
import { AppRoutingService } from '../shared/services/app-routing.service';

@Component({
  moduleId: module.id,
  selector: 'app-product-detail',
  templateUrl: 'product-detail.component.html',
  styleUrls: ['product-detail.component.css'],
  directives: [ FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES ],
  providers: [ ServerService ]
})
export class ProductDetailComponent implements OnInit {
  private subUrlLevel3: Subscription;
  private product: Product;
  private title: string;
  private myForm: FormGroup;

  constructor(
    public router: Router,
      private serverService: ServerService,
      private appRoutingService: AppRoutingService,
      private fb: FormBuilder) {
  }
  ngOnInit() {
    this.appRoutingService.setCurrentUrl(
      this.router.routerState.snapshot.url);
    this.subUrlLevel3 = this.appRoutingService.currentUrlLevel3.subscribe(
      (prodId : string) => {
        if (!prodId) {
          return;
        }
        else if (prodId === 'New') {
          this.title = 'Enter details for the new product:';
          this.product = new Product();
          this.buildForm(this.product);
        }
        else {
          let id = +prodId;
          this.serverService.getProduct(id)
            .then((product: Product) => {
              this.product = product;
              let oldName: string = this.product.editables.name.slice(0);
              this.title = 'Edit details for the product: ' + oldName;
              this.buildForm(this.product);
            });
        }
      }
    );
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subUrlLevel3.unsubscribe();
  }

  private buildForm(product: Product) : void {
    this.myForm = this.fb.group({
      'name': [product.editables.name, Validators.required],
      'department': [product.editables.department, Validators.required],
      'price': [product.editables.price.toFixed(2), Validators.compose([
        Validators.required, ProductDetailComponent.priceValidator])]
    });
  }
  private static priceValidator(control: FormControl) :
      {[s: string]: boolean} {
    if (!control.value.match(/^[0-9]+\.[0-9]{2}$/)) {
      return {invalidPrice: true};
    }
  }
  public save() : void {
    this.product.editables.name = this.myForm.controls['name'].value;
    this.product.editables.department = this.myForm.controls['department'].value;
    this.product.editables.price = +this.myForm.controls['price'].value;
    this.serverService
      .save(this.product) // product saved, id is given by the server
      .then(() => this.goBack());
  }
  private goBack() : void {
    window.history.back();
  }
}
