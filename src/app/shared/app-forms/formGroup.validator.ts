import { FormGroup } from '@angular/forms';

export function formGroupValidator(formGroup: FormGroup) :
{[errorProp: string]: boolean} {
  let foundInvalid: boolean = false;
  for (let control in formGroup.controls) {
    if (formGroup.controls[control] && !formGroup.controls[control].valid) {
      foundInvalid = true;
      break;
    }
  }
  if (foundInvalid === true) {
    return {foundInvalidControl: true};
  }
  else {
    return null;
  }
}
