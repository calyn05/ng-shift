import { Component, OnInit, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ResetPasswordService } from 'src/app/shared/services/reset-password.service';
import { PasswordValidators } from 'src/app/shared/validators/password-match';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.css',
    '../../../register/register.component.css',
  ],
})
export class ResetPasswordComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _resetService: ResetPasswordService = inject(ResetPasswordService);

  resetForm!: FormGroup;

  code!: string;

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.code = params['oobCode'];
    });

    this.resetForm = new FormGroup(
      {
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
      },
      {
        validators: PasswordValidators.MatchPassword,
      }
    );
  }

  reset() {
    this._resetService.resetPasswordWithCode(
      this.code,
      this.f['password'].value
    );

    console.log(this.f['password'].value, this.code);
  }

  get f() {
    return this.resetForm.controls;
  }

  get passwordValid() {
    return this.resetForm.controls['password'].valid === null;
  }

  get requireValid() {
    return !this.resetForm.controls['password'].hasError('required');
  }

  get minLengthValid() {
    return !this.resetForm.controls['password'].hasError('minlength');
  }

  get maxLengthValid() {
    return !this.resetForm.controls['password'].hasError('maxlength');
  }

  get hasNumberValid() {
    return !this.resetForm.controls['password'].hasError('hasNumber');
  }

  get hasCapitalCaseValid() {
    return !this.resetForm.controls['password'].hasError('hasCapitalCase');
  }

  get hasSmallCaseValid() {
    return !this.resetForm.controls['password'].hasError('hasSmallCase');
  }

  get hasSpecialCharactersValid() {
    return !this.resetForm.controls['password'].hasError(
      'hasSpecialCharacters'
    );
  }

  get confirmPasswordValid() {
    return this.resetForm.controls['confirmPassword'].valid === null;
  }
}
