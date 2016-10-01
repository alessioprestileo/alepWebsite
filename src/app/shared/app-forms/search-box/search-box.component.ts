import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {
  FormControl, FormGroup, FormControlDirective,
  Validators
} from '@angular/forms';

declare var jQuery: any;
declare var Bloodhound: any;

@Component({
  // moduleId: module.id,
  selector: 'app-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.css']
})
export class SearchBoxComponent implements OnDestroy, OnInit {
  @Input() private formControlKey: string;
  @Input() private inFormGroup: FormGroup;
  @Input() private label: string;
  @Input() private labelCssClass: string;
  @Input() private method: string;
  @Input() private source: any;
  @Input() private targetProperty: string;
  @Output() private emHasNotSuccess = new EventEmitter();
  @Output() private emHasSuccess = new EventEmitter();
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
    this.addFormControls();
    this.buildSuggestions();
  }
  ngOnDestroy() {
    this.removeFormControls();
  }

  private addFormControls() {
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
            source: this.suggestionsEngine.ttAdapter()
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
          prefetch: {
            // 'ttl' is the time (in milliseconds) the pre-fetched data should
            // be cached in local storage. Defaults to 86400000 (1 day).
            ttl: 300000,
            url: this.source
          }
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
      this.emHasSuccess.emit(info);
      this.typeaheadFormControl.setValue('typeaheadSuccess');
    }
    else {
      this.emHasNotSuccess.emit(this.targetProperty);
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
