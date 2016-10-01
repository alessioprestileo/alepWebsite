import {
  Component, DoCheck, ElementRef, Input, OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
  FormGroup, FormControl, ValidatorFn, Validators
} from '@angular/forms';

import { BehaviorSubject, Subscription } from 'rxjs/Rx';

import { appArrayPopAt } from '../../appFunctions';
import { formGroupValidator } from '../formGroup.validator';
import { WarehouseProd }        from '../../models/WarehouseProd';

class ExtraFieldsInfo {
  public controls: FormControl[];
  public fieldsLabel: string;
  public fieldsNames: string[];
  public fieldsValues: string[];

  constructor(
    controls: FormControl[] = [],
    fieldsLabel: string = 'Field',
    fieldsNames: string[] = [],
    fieldsValues: string[] = []
  ) {
    this.controls = controls;
    this.fieldsLabel = fieldsLabel;
    this.fieldsNames = fieldsNames;
    this.fieldsValues = fieldsValues;
  }
}

class HierarchyInfo {
  public controls: FormControl[];
  public pathsLabel: string;

  constructor(
    controls: FormControl[] = [],
    pathsLabel: string = 'Path'
  ) {
    this.controls = controls;
    this.pathsLabel = pathsLabel;
  }
}

@Component({
  // moduleId: module.id,
  selector: 'app-product-form',
  templateUrl: 'product-form.component.html',
  styleUrls: ['product-form.component.css']
})
export class ProductFormComponent
implements DoCheck, OnDestroy, OnInit {
  @Input() private newProd: boolean;
  @Input() private prodFormGroup: FormGroup;
  @Input() private product: WarehouseProd;
  @ViewChild("newExtraFieldName") private newExtraFieldName: ElementRef;
  private addingExtraField: boolean = false;
  private collapseExtraFields: boolean = false;
  private collapseHierarchy: boolean = false;
  private formGroupValidator: ValidatorFn = formGroupValidator;
  // Count decrements when an element is removed, nextId never decrements
  private extraFieldsCount: number = 0;
  private extraFieldsNextId: number = 0;
  private extraFieldsInfo: ExtraFieldsInfo = new ExtraFieldsInfo();
  private hierarchyInfo: HierarchyInfo = new HierarchyInfo();
  // Count decrements when an element is removed, nextId never decrements
  private hierarchyPathsCount: number = 0;
  private hierarchyPathsNextId: number = 0;
  private obProdFormValid: BehaviorSubject<boolean>;
  private obExtraFieldsForm: BehaviorSubject<any>;
  private obHierarchyForm: BehaviorSubject<any>;
  private subExtraFieldsForm: Subscription;
  private subHierarchyForm: Subscription;
  // private subImgSrcControl: Subscription;
  private subNameControl: Subscription;
  private subPriceControl: Subscription;
  private subProdFormValid: Subscription;
  private subQuantityControl: Subscription;

  constructor() {
  }

  ngOnInit() {
    if (this.product) {
      this.addFormControls();
      this.createFormObsAndSubs();
      this.createControlsSubs();
      if (!this.newProd) {
        this.initializeExtraFieldsControls();
        this.initializeHierarchyControls();
      }
      else {
        this.hierarchyPathAdd('component+product');
      }
    }
  }
  ngOnDestroy() {
    this.removeFormControls();
    this.cancelSubs();
  }
  ngDoCheck() {
  }

  private addFormControls() : void {
    this.prodFormGroup.addControl('extraFields', new FormGroup(
      {}, this.formGroupValidator
    ));
    this.prodFormGroup.addControl('hierarchy', new FormGroup(
      {}, this.formGroupValidator
    ));
    // this.prodFormGroup.addControl('imgSrc', new FormControl(
    //   this.product.imgSrc, null
    // ));
    this.prodFormGroup.addControl('name', new FormControl(
      this.product.name, Validators.required
    ));
    this.prodFormGroup.addControl('price', new FormControl(
      this.product.price.toFixed(2), Validators.compose([
        Validators.required, this.priceValidator]
      )
    ));
    this.prodFormGroup.addControl('quantity', new FormControl(
      this.product.quantity, Validators.required
    ));
  }
  private cancelSubs() : void {
    this.subExtraFieldsForm.unsubscribe();
    this.subHierarchyForm.unsubscribe();
    this.subProdFormValid.unsubscribe();
  }
  private createControlsSubs() : void {
    // this.subImgSrcControl = this.prodFormGroup.controls[
    //   'imgSrc'
    //   ].valueChanges.subscribe((value: string) : void => {
    //     this.product.imgSrc = value;
    //   }
    // );
    this.subNameControl = this.prodFormGroup.controls[
      'name'
      ].valueChanges.subscribe((value: string) : void => {
        this.product.name = value;
      }
    );
    this.subPriceControl = this.prodFormGroup.controls[
      'price'
      ].valueChanges.subscribe((value: string) : void => {
        this.product.price = +value;
      }
    );
    this.subQuantityControl = this.prodFormGroup.controls[
      'quantity'
      ].valueChanges.subscribe(
      (value: string) : void => {
        this.product.quantity = +value;
      }
    );
  }
  private createFormObsAndSubs() : void {
    this.obExtraFieldsForm = new BehaviorSubject(null);
    this.obHierarchyForm = new BehaviorSubject(null);
    this.obProdFormValid = new BehaviorSubject(false);
    this.subExtraFieldsForm =
      this.prodFormGroup.controls['extraFields'].valueChanges.subscribe(
        () => {
          let formGroup: FormGroup =
            <FormGroup>this.prodFormGroup.controls['extraFields'];
          if (formGroup.valid) {
            for (let controlName in formGroup.controls) {
              let value: string = formGroup.controls[controlName].value;
              this.product.extraFields[controlName] = value;
              let index: number =
                this.extraFieldsInfo.fieldsNames.indexOf(controlName);
              this.extraFieldsInfo.fieldsValues[index] = value;
            }
          }
        }
      );
    this.subHierarchyForm =
      this.prodFormGroup.controls['hierarchy'].valueChanges.subscribe(
        () => {
          let formGroup: FormGroup =
            <FormGroup>this.prodFormGroup.controls['hierarchy'];
          if (formGroup.valid) {
            let counter: number = 0;
            for (let controlName in formGroup.controls) {
              this.product.hierarchy[counter] =
                formGroup.controls[controlName].value;
              counter ++;
            }
          }
        }
      );
    this.subProdFormValid = this.prodFormGroup.valueChanges.subscribe(
      () => this.obProdFormValid.next(this.prodFormGroup.valid)
    );
  }
  public extraFieldAdd(target: string, fieldName: string) : void {
    let initialValue: string;
    if (target === 'component+product' ||
       (target === 'component')) {
      this.extraFieldsCount += 1;
      this.extraFieldsNextId += 1;
      let label: string = fieldName;
      if (target === 'component+product') {
        initialValue = '';
        this.product.extraFields[label] = initialValue;
      }
      else {
        initialValue = this.product.extraFields[label];
      }
      this.extraFieldsInfo.controls.push(
        this.extraFieldControlAdd(label, initialValue)
      );
      this.extraFieldsInfo.fieldsNames.push(label);
      this.extraFieldsInfo.fieldsValues.push(initialValue);
    }
    else {
      console.log('ERROR: INVALID INPUT from collectionAdd method in ' +
        'ChartFormComponent');
    }
  }
  private extraFieldControlAdd(
    key: string, initialValue: string
  ) : FormControl {
    let formGroup: FormGroup =
      <FormGroup>(this.prodFormGroup.controls['extraFields']);
    formGroup.addControl(key, new FormControl(
      initialValue, Validators.required
    ));
    return (<FormControl>formGroup.controls[key]);
  }
  private extraFieldControlRemoveByKey(key: string) : void {
    let formGroup: FormGroup =
      <FormGroup>(this.prodFormGroup.controls['extraFields']);
    formGroup.removeControl(key);
  }
  public extraFieldRemove(index: number, label: string) : void {
    this.extraFieldsInfo.controls = appArrayPopAt<FormControl>(
      this.extraFieldsInfo.controls, index
    );
    this.extraFieldsInfo.fieldsNames = appArrayPopAt<string>(
      this.extraFieldsInfo.fieldsNames, index
    );
    this.extraFieldsInfo.fieldsValues = appArrayPopAt<string>(
      this.extraFieldsInfo.fieldsValues, index
    );
    this.extraFieldsCount -= 1;
    this.extraFieldControlRemoveByKey(label);
    delete this.product.extraFields[label];
  }
  private hierarchyControlAdd(key: string, initialValue: string) : FormControl {
    let formGroup: FormGroup =
      <FormGroup>(this.prodFormGroup.controls['hierarchy']);
    formGroup.addControl(key, new FormControl(
      initialValue, Validators.required
    ));
    return (<FormControl>formGroup.controls[key]);
  }
  private hierarchyControlRemoveByKey(key: string) : void {
    let formGroup: FormGroup =
      <FormGroup>(this.prodFormGroup.controls['hierarchy']);
    formGroup.removeControl(key);
  }
  public hierarchyPathAdd(target: string) : void {
    let initialValue: string;
    if (target === 'component+product' ||
      target === 'component') {
      this.hierarchyPathsCount += 1;
      let label: string = this.hierarchyInfo.pathsLabel + ' ' +
        this.hierarchyPathsNextId.toString();
      this.hierarchyPathsNextId += 1;
      if (target === 'component+product') {
        initialValue = '';
        this.product.hierarchy.push('');
      }
      else {
        initialValue = this.product.hierarchy[this.hierarchyPathsCount - 1];
      }
      this.hierarchyInfo.controls.push(
        this.hierarchyControlAdd(label, initialValue)
      );
    }
    else {
      console.log('ERROR: INVALID INPUT from collectionAdd method in ' +
        'ChartFormComponent');
      return null;
    }
  }
  public hierarchyPathRemove(index: number, label: string) : void {
    this.hierarchyInfo.controls = appArrayPopAt<FormControl>(
      this.hierarchyInfo.controls, index
    );
    this.hierarchyPathsCount -= 1;
    this.hierarchyControlRemoveByKey(label);
    this.product.hierarchy = appArrayPopAt<string>(
      this.product.hierarchy, index
    );
  }
  private initializeExtraFieldsControls() : void {
    let extraFields: Object = this.product.extraFields;
    for (let field in extraFields) {
      this.extraFieldAdd('component', field);
    }
  }
  private initializeHierarchyControls() : void {
    let length: number = this.product.hierarchy.length;
    for (let i = 0; i < length; i++) {
      this.hierarchyPathAdd('component');
    }
  }
  public onExtraFieldAdd() : void {
    let newExtraFieldName: string = this.newExtraFieldName.nativeElement.value;
    this.addingExtraField = false;
    this.extraFieldAdd('component+product', newExtraFieldName);
  }
  public onExtraFieldRemove(index: number) : void {
    let label: string = this.extraFieldsInfo.fieldsNames[index];
    this.extraFieldRemove(index, label);
  }
  public onHierarchyPathAdd() : void {
    this.hierarchyPathAdd('component+product');
  }
  public onHierarchyPathRemove(index: number) : void {
    let label: string = this.hierarchyInfo.pathsLabel + ' ' + index.toString();
    this.hierarchyPathRemove(index, label);
  }
  private priceValidator(control: FormControl) :
  {[s: string]: boolean} {
    if (!control.value.match(/^[0-9]+\.[0-9]{2}$/)) {
      return {invalidPrice: true};
    }
  }
  private removeFormControls() : void {
    // this.prodFormGroup.removeControl('imgSrc');
    this.prodFormGroup.removeControl('name');
    this.prodFormGroup.removeControl('price');
    this.prodFormGroup.removeControl('quantity');
  }
}
