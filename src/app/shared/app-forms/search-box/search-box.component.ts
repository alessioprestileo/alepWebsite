import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES, FormControl, FormGroup, FormControlDirective,
  Validators
} from '@angular/forms';

declare var jQuery: any;
declare var Bloodhound: any;

@Component({
  moduleId: module.id,
  selector: 'app-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class SearchBoxComponent implements OnDestroy, OnInit {
  @Input() private formControlKey: string;
  @Input() private inFormGroup: FormGroup;
  @Input() private label: string;
  @Input() private labelCssClass: string;
  @Input() private method: string;
  @Input() private source: any;
  @Input() private targetProperty: string;
  @Output() private hasNotSuccessEmitter = new EventEmitter();
  @Output() private hasSuccessEmitter = new EventEmitter();
  @ViewChild("box") private box: ElementRef;
  @ViewChild("searchBox") private searchBox: ElementRef;

  private boxFormControl: FormControl;
  private hasSelection: boolean = false;
  private labelDefaultCssClass: string = 'app-input-box-label';
  private lastSelection: string;
  private suggestions: any;
  private suggestionsEngine: any;
  private typeaheadFormControl: FormControl;

  constructor() {}

  ngOnInit() {
    this.addFormControlsAndSubs();
    this.buildSuggestions();
  }
  ngOnDestroy() {
    this.removeFormControls();
  }

  private addFormControlsAndSubs() {
    this.inFormGroup.addControl(
      this.formControlKey,
      new FormControl(null, Validators.required)
    );
    this.inFormGroup.addControl(
      this.formControlKey + '-typeahead',
      new FormControl(null, this.typeaheadValidator)
    );
    this.boxFormControl = (
      <FormControl>this.inFormGroup.controls[this.formControlKey]
    );
    this.typeaheadFormControl = (
      <FormControl>this.inFormGroup.controls[
        this.formControlKey + '-typeahead'
      ]
    );
    this.boxFormControl.valueChanges.subscribe(
      () : void => this.inFormGroup.updateValueAndValidity()
    );
    this.typeaheadFormControl.valueChanges.subscribe(
      () : void => this.inFormGroup.updateValueAndValidity()
    );
  }

  private buildSuggestions() {
    let switcher: string = this.method;
    switch (switcher) {
      case 'local':
        // constructs the suggestion engine
        this.suggestionsEngine = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.whitespace,
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: this.source
        });
        // constructs the suggestions
        this.suggestions = jQuery(this.searchBox.nativeElement).find(
          '.typeahead'
        ).typeahead({
              hint: true,
              highlight: true,
              minLength: 1
            },
            {
              name: 'suggestions',
              limit: 100,
              source: this.suggestionsEngine
            }
          );
        this.suggestions.on(
          "typeahead:selected " + "typeahead:autocompleted",
          (e, args) => {
            this.lastSelection = args;
            this.hasSelection = true;
          }
        );
        break;
      case 'prefetch':
        // constructs the suggestion engine
        this.suggestionsEngine = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace(
            this.targetProperty
          ),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          prefetch: {url: this.source}
        });
        // constructs the suggestions
        this.suggestions = jQuery(this.searchBox.nativeElement).find(
          '.typeahead'
        ).typeahead({
              hint: true,
              highlight: true,
              minLength: 1
            },
            {
              name: 'suggestions',
              limit: 100,
              displayKey: this.targetProperty,
              source: this.suggestionsEngine.ttAdapter()
            }
          );
        this.suggestions.on(
          "typeahead:selected " + "typeahead:autocompleted",
          (e, args) => {
            this.lastSelection = args[this.targetProperty];
            this.hasSelection = true;
          }
        );
        break;
    }
  }
  public hasError(reference: FormControlDirective) : boolean {
    let result : boolean;
    let hasFocus = jQuery(this.box.nativeElement).is(":focus");

    if (reference.control &&
        !reference.control.valid &&
        !reference.control.pristine) {
      result = (this.boxFormControl.value) ? true: false;
    }
    else if (hasFocus === false &&
             reference.control &&
             !reference.control.pristine &&
             this.boxFormControl.value !== this.lastSelection) {
      result = true;
    }
    else {
      result = false;
    }
    return result;
  }
  public hasSuccess() : boolean {
    let result : boolean;

    if (this.hasSelection === true) {
      result = true;
      this.box.nativeElement.value = this.lastSelection;
      this.boxFormControl.setValue(this.lastSelection);
      this.hasSelection = false;
    }
    else {
      result = (
        this.box.nativeElement.value === this.lastSelection
      ) ? true : false;
    }
    if (result === true) {
      let info: Object = {
        'targetProperty': this.targetProperty,
        'value': this.lastSelection
      };
      this.hasSuccessEmitter.emit(info);
      this.typeaheadFormControl.setValue('typeaheadSuccess');
    }
    else {
      this.hasNotSuccessEmitter.emit(this.targetProperty);
      this.typeaheadFormControl.setValue('typeaheadNotSuccess');
    }
    return result;
  }
  private removeFormControls() {
    this.inFormGroup.removeControl(this.formControlKey);
    this.inFormGroup.removeControl(this.formControlKey + '-typeahead');

}
  private typeaheadValidator(
    control: FormControl
  ) : {[errorProp: string]: boolean} {
    if (control.value === 'typeaheadNotSuccess') {
      return {typeaheadError: true};
    }
    else {
      return null;
    }
  }
}
