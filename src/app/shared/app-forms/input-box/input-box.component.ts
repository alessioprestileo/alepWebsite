import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: 'input-box.component.html',
  styleUrls: ['input-box.component.css']
})
export class InputBoxComponent implements OnInit {
  @Input() private inFormControl: FormControl;
  @Input() private boxCssClass: string;
  @Input() private labelCssClass: string;
  @Input() private label: string;
  @Input() private placeHolder: string;
  @Input() private type: string;

  constructor() {
  }

  ngOnInit() {
  }
}
