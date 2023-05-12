import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PasswordValidators } from 'src/app/shared/validators/password-match';

import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;

  @Input() code!: FormControl;

  isSubmitted: boolean = false;

  constructor(private auth: AuthService, private _loader: LoaderService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]),
        password: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            PasswordValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
              hasNumber: true,
            }),
            PasswordValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
              hasCapitalCase: true,
            }),
            PasswordValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
              hasSmallCase: true,
            }),
            PasswordValidators.patternValidator(
              new RegExp('(?=.*[!@#$%^&*()_+])'),
              { hasSpecialCharacters: true }
            ),
          ])
        ),
        confirmPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        firstName: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        lastName: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        age: new FormControl(null, [
          Validators.required,
          Validators.min(18),
          Validators.max(130),
        ]),
        isAdmin: new FormControl(false),
        code: new FormControl(null, []),
      },
      {
        validators: PasswordValidators.MatchPassword,
      }
    );

    this.registerForm.get('isAdmin')?.valueChanges.subscribe((value) => {
      if (value) {
        this.registerForm
          .get('code')
          ?.setValidators([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ]);
      } else {
        this.registerForm.get('code')?.clearValidators();
      }
      this.registerForm.get('code')?.updateValueAndValidity();
    });

    this.registerForm.valueChanges.subscribe((value) => {
      this.canExit();
    });
  }

  canExit(): boolean {
    if (this.registerForm.dirty && this.isSubmitted === false) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {}

  // getters for form controls

  get f() {
    return this.registerForm.controls;
  }

  get passwordValid() {
    return this.registerForm.controls['password'].valid === null;
  }

  get requireValid() {
    return !this.registerForm.controls['password'].hasError('required');
  }

  get minLengthValid() {
    return !this.registerForm.controls['password'].hasError('minlength');
  }

  get maxLengthValid() {
    return !this.registerForm.controls['password'].hasError('maxlength');
  }

  get hasNumberValid() {
    return !this.registerForm.controls['password'].hasError('hasNumber');
  }

  get hasCapitalCaseValid() {
    return !this.registerForm.controls['password'].hasError('hasCapitalCase');
  }

  get hasSmallCaseValid() {
    return !this.registerForm.controls['password'].hasError('hasSmallCase');
  }

  get hasSpecialCharactersValid() {
    return !this.registerForm.controls['password'].hasError(
      'hasSpecialCharacters'
    );
  }

  get confirmPasswordValid() {
    return this.registerForm.controls['confirmPassword'].valid === null;
  }

  get ageValid() {
    return this.registerForm.controls['age'].valid === null;
  }

  get firstNameValid() {
    return this.registerForm.controls['firstName'].valid === null;
  }

  get lastNameValid() {
    return this.registerForm.controls['lastName'].valid === null;
  }

  get isAdmin() {
    return this.registerForm.controls['isAdmin'].value;
  }

  get codeValid() {
    return this.registerForm.controls['code'].valid === null;
  }

  async register(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number,
    isAdmin: boolean,
    code: string
  ) {
    this._loader.setLoading(true);
    this.auth.register(
      email,
      username,
      password,
      firstName,
      lastName,
      age,
      isAdmin,
      code
    );
    this.isSubmitted = true;
  }

  patchValues() {
    this.registerForm.setValue({
      email: 'john@codes.com ',
      username: 'johndoe',
      password: '12Saaa@',
      confirmPassword: '12Saaa@',
      firstName: 'John',
      lastName: 'Codes',
      age: 20,
      isAdmin: false,
      code: 'admin1',
    });
  }
}
