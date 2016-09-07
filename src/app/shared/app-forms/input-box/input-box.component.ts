import { Component, DoCheck, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES, FormControl, FormControlDirective
} from '@angular/forms';

declare var jQuery: any;

@Component({
  moduleId: module.id,
  selector: 'app-input-box',
  templateUrl: 'input-box.component.html',
  styleUrls: ['input-box.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class InputBoxComponent implements DoCheck, OnInit {
  @Input() private inFormControl: FormControl;
  @Input() private labelCssClass: string;
  @Input() private label: string = 'Value:';
  @Input() private placeHolder: string;
  @ViewChild("box") private box: ElementRef;

  private labelDefaultCssClass: string = 'app-input-box-label';

  constructor() {}

  ngOnInit() {}

  ngDoCheck() {
    this.setPlaceHolder();
  }

  public hasError(reference: FormControlDirective) : boolean {
    let result : boolean =
      (reference.control && !reference.control.valid &&
          !reference.control.pristine) ?
        true: false;
    return result;
  }
  public hasSuccess(reference: FormControlDirective) : boolean {
    let result : boolean =
      (reference.control && reference.control.valid &&
          !reference.control.pristine) ?
        true: false;
    return result;
  }
  private setPlaceHolder() : void {
    if (!this.placeHolder) {
      this.placeHolder = 'Insert ' +
        this.label.toLocaleLowerCase()
          .substr(0, this.label.length - 1);
    }
    let element: any = jQuery(this.box.nativeElement);
    if (!element.val()) {
      element.attr("placeholder", this.placeHolder);
    }
  }
}
