import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ResetPasswordService } from 'src/app/shared/services/reset-password.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PasswordValidators } from 'src/app/shared/validators/password-match';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: [
    './edit-profile.component.css',
    '../../../register/register.component.css',
  ],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private _authService: AuthService = inject(AuthService);
  private _userService: UserService = inject(UserService);
  private _resetPasswordService: ResetPasswordService =
    inject(ResetPasswordService);

  opened!: boolean;
  isSubmitted: boolean = false;

  editForm!: FormGroup;
  editables: HTMLInputElement[] = [];

  property!: string;

  constructor(private _snackbarComponent: SnackbarComponent) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.property = params['property'];
    });

    this.changeProperty();
  }

  canExit(): boolean {
    if (this.editForm.dirty && !this.isSubmitted) {
      return false;
    } else {
      return true;
    }
  }

  changeProperty() {
    switch (this.property) {
      case 'email':
        this.editForm = new FormGroup({
          email: new FormControl(null, [Validators.email, Validators.required]),
        });
        break;

      case 'password':
        this.editForm = new FormGroup(
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
              Validators.maxLength(20),
            ]),
          },
          { validators: PasswordValidators.MatchPassword }
        );
        break;
      case 'name':
        this.editForm = new FormGroup({
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
        });
        break;
      case 'age':
        this.editForm = new FormGroup({
          age: new FormControl(null, [
            Validators.required,
            Validators.min(18),
            Validators.max(130),
          ]),
        });
        break;

      default:
        break;
    }
  }

  updateEmail() {
    this._userService.getUserData().subscribe((data) => {
      const username = data.username;

      this._authService.updateEmail(username, this.editForm.value.email);
    });
    this.isSubmitted = true;
  }

  updatePassword() {
    this._resetPasswordService.updatePassword(this.editForm.value.password);
    this.isSubmitted = true;
  }

  updateName() {
    this.isSubmitted = true;
    this._userService.getUserData().subscribe((data) => {
      const username = data.username;
      const firstName = this.editForm.value.firstName;
      const lastName = this.editForm.value.lastName;

      this._userService.updatePersonalData(username, firstName, lastName);
    });
  }

  updateAge() {
    this.isSubmitted = true;
    console.log(this.editForm.value);

    this._userService.getUserData().subscribe((data) => {
      const username = data.username;
      const age = this.editForm.value.age;

      this._userService.updatePersonalData(username, '', '', age);
    });
  }

  ngOnDestroy(): void {}

  get f() {
    return this.editForm.controls;
  }

  get passwordValid() {
    return this.editForm.controls['password'].valid === null;
  }

  get requireValid() {
    return !this.editForm.controls['password'].hasError('required');
  }

  get minLengthValid() {
    return !this.editForm.controls['password'].hasError('minlength');
  }

  get maxLengthValid() {
    return !this.editForm.controls['password'].hasError('maxlength');
  }

  get hasNumberValid() {
    return !this.editForm.controls['password'].hasError('hasNumber');
  }

  get hasCapitalCaseValid() {
    return !this.editForm.controls['password'].hasError('hasCapitalCase');
  }

  get hasSmallCaseValid() {
    return !this.editForm.controls['password'].hasError('hasSmallCase');
  }

  get hasSpecialCharactersValid() {
    return !this.editForm.controls['password'].hasError('hasSpecialCharacters');
  }

  get confirmPasswordValid() {
    return this.editForm.controls['confirmPassword'].valid === null;
  }
}
