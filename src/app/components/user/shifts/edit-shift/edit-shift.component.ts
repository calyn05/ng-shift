import { Component, OnChanges, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, delay } from 'rxjs';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Shift } from 'src/app/shared/models/shift';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UniqueNameDirective } from 'src/app/shared/validators/unique-name.directive';
import { DateValidatorDirective } from 'src/app/shared/validators/date-validator.directive';
import { LoaderService } from 'src/app/shared/services/loader.service';
import {
  DialogComponent,
  DialogData,
} from 'src/app/components/partials/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit-shift.component.html',
  styleUrls: [
    './edit-shift.component.css',
    '../../../register/register.component.css',
  ],
})
export class EditShiftComponent implements OnInit, OnChanges {
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _loader: LoaderService = inject(LoaderService);
  private _dialog: MatDialog = inject(MatDialog);

  updateShiftForm!: FormGroup;
  isSubmitted: boolean = false;

  shiftToEdit!: Shift | undefined | null;
  shiftName!: string;

  ngOnChanges(): void {}

  ngOnInit(): void {
    this._loader.setLoading(true);
    this._userService.getCurrentUser().then((user) => {
      this._userService.getUserData().subscribe((userData) => {
        const username = userData.username;
        this._route.params.subscribe((params) => {
          this._shiftsService
            .getShiftsByUsername(username)
            .subscribe((shifts) => {
              const shift = shifts.find(
                (shift) => shift.uniqueName === params['id']
              )!;
              if (shift) {
                this.shiftToEdit = shift;
                this.updateShiftForm.patchValue({
                  startDate: shift.startDate,
                  startTime: shift.startTime,
                  endDate: shift.endDate,
                  endTime: shift.endTime,
                  wage: shift.wage,
                  location: shift.location,
                  uniqueName: shift.uniqueName,
                  description: shift.description,
                });
              }
              this._loader.setLoading(false);
            });
        });
      });
    });

    this.updateShiftForm = new FormGroup(
      {
        startDate: new FormControl(null, [Validators.required]),
        startTime: new FormControl(null, [Validators.required]),
        endDate: new FormControl(null, [Validators.required]),
        endTime: new FormControl(null, [Validators.required]),
        wage: new FormControl(null, [
          Validators.required,
          Validators.max(10000000),
        ]),
        location: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        uniqueName: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        description: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ]),
      },
      {
        validators: DateValidatorDirective.dateValidator(),
      }
    );

    this.uniqueName?.valueChanges.subscribe((value) => {
      if (this.shiftToEdit?.uniqueName !== value) {
        this.uniqueName?.addAsyncValidators(
          UniqueNameDirective.uniqueName(this._shiftsService, this._userService)
        );
      } else {
        this.uniqueName?.clearAsyncValidators();
        this.uniqueName?.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false,
        });
      }
    });
  }

  async updateShift(addShiftForm: FormGroup) {
    const updatedShift = new Shift(
      addShiftForm.value.uniqueName,
      addShiftForm.value.startDate,
      addShiftForm.value.startTime,
      addShiftForm.value.endDate,
      addShiftForm.value.endTime,
      addShiftForm.value.wage,
      addShiftForm.value.location,
      addShiftForm.value.description,
      this.shiftToEdit!.username
    );
    this._loader.setLoading(true);
    this._shiftsService
      .updateShift(this.shiftToEdit!, updatedShift)
      .subscribe(() => {
        this._snackbarComponent.openSnackbar(
          'Shift updated successfully!',
          'Close',
          'success-snackbar'
        );
        this.isSubmitted = true;

        this._router.navigate(['/shifts']);
      });
  }

  canExit(): boolean {
    if (this.updateShiftForm.dirty && !this.isSubmitted) {
      return false;
    }
    return true;
  }

  openDialog(): void {
    const message = 'Are you sure you want to delete this shift?';
    const data = new DialogData('Delete shift', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteShift();
      }
      this._dialog.closeAll();
    });
  }

  async deleteShift() {
    this._shiftsService.deleteShift(this.shiftToEdit!).subscribe(() => {
      this._snackbarComponent.openSnackbar(
        'Shift deleted successfully!',
        'Close',
        'success-snackbar'
      );

      this._router.navigate(['/shifts']);
    });
  }

  showErrors(): void {
    if (this.updateShiftForm.controls['endDate'].errors?.['startDate']) {
      this._snackbarComponent.openSnackbar(
        "End date can't be before start date",
        'Close',
        'error-snackbar'
      );
    } else if (this.updateShiftForm.controls['endTime'].errors?.['startTime']) {
      this._snackbarComponent.openSnackbar(
        "End time can't be before start time",
        'Close',
        'error-snackbar'
      );
    } else {
      this._snackbarComponent.closeSnackbar();
    }
  }

  get uniqueName() {
    return this.updateShiftForm.get('uniqueName');
  }
}
