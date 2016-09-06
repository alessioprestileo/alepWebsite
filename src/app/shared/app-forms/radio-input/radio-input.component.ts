import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";

declare var jQuery: any;

@Component({
  moduleId: module.id,
  selector: 'app-radio-input',
  templateUrl: 'radio-input.component.html',
  styleUrls: ['radio-input.component.css']
})
export class RadioInputComponent implements OnInit {
  @Input() private inFormControl: FormControl;
  @Input() private labels: string[];
  @ViewChild("radioInput") private radioInput: ElementRef;

  constructor() {}

  ngOnInit() {

  }

  public onClicked(inputIndex: number) {
    jQuery(this.radioInput.nativeElement).find('.app-radio-option').each(
      (index: number, element: HTMLInputElement) => {
        if (inputIndex === index) {
          element.checked = true;
          (<FormControl>this.inFormControl).setValue(element.value);
        }
        else {
          element.checked = false;
        }
      }
    );

  }
}
