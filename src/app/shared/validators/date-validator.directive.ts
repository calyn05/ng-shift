import { Directive } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormGroup,
} from '@angular/forms';

@Directive({
  selector: '[appDateValidator]',
})
export class DateValidatorDirective {
  static dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const startDate: Date = control.get('startDate')?.value;
      const startTime: Date = control.get('startTime')?.value;
      const endDate: Date = control.get('endDate')?.value;
      const endTime: Date = control.get('endTime')?.value;

      if (!startDate || !startTime || !endDate || !endTime) {
        return null;
      }

      if (startDate > endDate) {
        control.get('endDate')?.setErrors({ startDate: true });
      }

      if (startDate === endDate && startTime > endTime) {
        control.get('endTime')?.setErrors({ startTime: true });
      }

      return null;
    };
  }
}
