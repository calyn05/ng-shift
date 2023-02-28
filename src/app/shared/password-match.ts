import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static MatchPassword(control: AbstractControl): ValidationErrors | null {
    const password: string = control.get('password')?.value;
    const confirmPassword: string = control.get('confirmPassword')?.value;

    if (!confirmPassword?.length) {
      return null;
    }

    if (confirmPassword.length < 6) {
      control.get('confirmPassword')?.setErrors({ minLength: true });
    } else {
      if (password !== confirmPassword) {
        control.get('confirmPassword')?.setErrors({ misMatch: true });
      } else {
        return null;
      }
    }

    return null;
  }
}
