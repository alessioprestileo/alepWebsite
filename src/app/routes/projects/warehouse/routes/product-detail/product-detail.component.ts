import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder,
  FormControl, Validators
} from '@angular/forms';

import { WarehouseProd }        from '../../../../../shared/models/WarehouseProd';
import { WarehouseService } from '../../../../../shared/services/warehouse.service';
import { AppRoutingService } from '../../../../../shared/services/app-routing.service';

@Component({
  moduleId: module.id,
  selector: 'app-product-detail',
  templateUrl: 'product-detail.component.html',
  styleUrls: ['product-detail.component.css'],
  directives: [
    FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES
  ]
})
export class ProductDetailComponent implements OnInit {
  private myForm: FormGroup;
  private product: WarehouseProd;
  private title: string;

  constructor(
    private warehouseService: WarehouseService,
    private appRoutingService: AppRoutingService,
    private fb: FormBuilder) {
  }
  ngOnInit() {

  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
  }

  private buildForm(product: WarehouseProd) : void {
    this.myForm = this.fb.group({
      'name': [product.name, Validators.required],
      // 'department': [product.department, Validators.required],
      'price': [product.price.toFixed(2), Validators.compose([
        Validators.required, this.priceValidator])]
    });
  }
  private priceValidator(control: FormControl) :
      {[s: string]: boolean} {
    if (!control.value.match(/^[0-9]+\.[0-9]{2}$/)) {
      return {invalidPrice: true};
    }
  }
  public save() : void {
    this.product.name = this.myForm.controls['name'].value;
    // this.product.department = this.myForm.controls['department'].value;
    this.product.price = +this.myForm.controls['price'].value;
    this.warehouseService
      // save product, id given by the server
      .saveItem('products', this.product)
      .then(() => this.goBack());
  }
  private goBack() : void {
    window.history.back();
  }
}
