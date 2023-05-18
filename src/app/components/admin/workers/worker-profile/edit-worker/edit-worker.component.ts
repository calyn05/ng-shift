import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PasswordValidators } from 'src/app/shared/validators/password-match';

@Component({
  selector: 'app-edit-worker',
  templateUrl: './edit-worker.component.html',
  styleUrls: [
    './edit-worker.component.css',
    '../../../../user/profile/edit-profile/edit-profile.component.css',
    '../../../../register/register.component.css',
  ],
})
export class EditWorkerComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _adminService: AdminService = inject(AdminService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);

  editForm!: FormGroup;
  editables: HTMLInputElement[] = [];
  opened!: boolean;
  isSubmitted: boolean = false;
  username!: string;

  property!: string;

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.property = params['property'];
      this.username = params['id'];
    });

    this.changeProperty();
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

  canExit(): boolean {
    if (this.editForm.dirty && !this.isSubmitted) {
      return false;
    } else {
      return true;
    }
  }

  updateEmail() {
    this._adminService.getWorker(this.username).subscribe((worker) => {
      const uid = worker[0].uid;
      this._adminService
        .updateDbEmail(this.username, this.editForm.value.email)
        .subscribe(() => {
          this._adminService
            .changeWorkerEmail(uid!, this.editForm.value.email)
            .subscribe(() => {
              this._snackbarComponent.openSnackbar(
                'Email updated successfully!',
                'Success',
                'success-snackbar'
              );
            })
            .add(() => {
              this.isSubmitted = true;
              this._router.navigate(['/admin/workers']);
            });
        });
    });
  }

  updatePassword() {
    this._adminService.getWorker(this.username).subscribe((worker) => {
      const uid = worker[0].uid;
      this._adminService
        .changeWorkerPassword(uid!, this.editForm.value.password)
        .subscribe(() => {
          this._snackbarComponent.openSnackbar(
            'Password updated successfully!',
            'Success',
            'success-snackbar'
          );
        })
        .add(() => {
          this.isSubmitted = true;
          this._router.navigate(['/admin/workers']);
        });
    });
  }

  updateName() {
    this._adminService.getWorker(this.username).subscribe(() => {
      this._adminService
        .updatePersonalData(
          this.username,
          this.editForm.value.firstName,
          this.editForm.value.lastName
        )
        .subscribe(() => {})
        .add(() => {
          this._snackbarComponent.openSnackbar(
            'Name updated successfully!',
            'Success',
            'success-snackbar'
          );
          this.isSubmitted = true;
          this._router.navigate(['/admin/workers']);
        });
    });
  }

  updateAge() {
    this._adminService.getWorker(this.username).subscribe(() => {
      this._adminService
        .updatePersonalData(this.username, '', '', this.editForm.value.age)
        .subscribe(() => {})
        .add(() => {
          this._snackbarComponent.openSnackbar(
            'Age updated successfully!',
            'Success',
            'success-snackbar'
          );
          this.isSubmitted = true;
          this._router.navigate(['/admin/workers/' + this.username]);
        });
    });
  }

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
