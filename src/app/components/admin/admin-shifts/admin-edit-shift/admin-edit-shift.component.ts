import { Component, OnInit, inject } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DialogComponent,
  DialogData,
} from 'src/app/components/partials/dialog/dialog.component';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { Shift } from 'src/app/shared/models/shift';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';
import { DateValidatorDirective } from 'src/app/shared/validators/date-validator.directive';
import { UniqueNameDirective } from 'src/app/shared/validators/unique-name.directive';

@Component({
  selector: 'app-admin-edit-shift',
  templateUrl: './admin-edit-shift.component.html',
  styleUrls: [
    './admin-edit-shift.component.css',
    '../../../user/shifts/edit-shift/edit-shift.component.css',
    '../../../register/register.component.css',
  ],
})
export class AdminEditShiftComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);
  private _loader: LoaderService = inject(LoaderService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _dialog: MatDialog = inject(MatDialog);

  updateShiftForm!: FormGroup;

  isSubmitted: boolean = false;

  shiftToEdit!: Shift | undefined | null;
  shiftName: string = '';
  shiftWorker!: string | undefined | null;

  ngOnInit(): void {
    this.updateShiftForm = new FormGroup(
      {
        startDate: new FormControl('', [Validators.required]),
        startTime: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
        endTime: new FormControl('', [Validators.required]),
        wage: new FormControl('', [
          Validators.required,
          Validators.max(10000000),
        ]),
        location: new FormControl('', [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(2),
        ]),
        uniqueName: new FormControl('', [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(2),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(2),
        ]),
      },
      {
        validators: DateValidatorDirective.dateValidator(),
      }
    );

    this._loader.setLoading(true);
    this._route.params.subscribe((params) => {
      const shift = params['id'];
      this._shiftsService.getShiftByName(shift).subscribe((shift) => {
        this.shiftToEdit = shift;
        this.shiftName = shift.uniqueName;
        this.shiftWorker = shift.username;
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
        this.updateShiftForm.get('uniqueName')?.disable();
        this._loader.setLoading(false);
      });
    });

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
    this._loader.setLoading(true);
    const updatedShift = new Shift(
      this.shiftName!,
      addShiftForm.value.startDate,
      addShiftForm.value.startTime,
      addShiftForm.value.endDate,
      addShiftForm.value.endTime,
      addShiftForm.value.wage,
      addShiftForm.value.location,
      addShiftForm.value.description,
      this.shiftToEdit!.username
    );
    this._shiftsService
      .updateShift(this.shiftToEdit!, updatedShift)
      .subscribe(() => {
        this._snackbarComponent.openSnackbar(
          'Shift updated successfully!',
          'Close',
          'success-snackbar'
        );
        this.isSubmitted = true;
      });
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

  canExit(): boolean {
    if (this.updateShiftForm.dirty && !this.isSubmitted) {
      return false;
    }
    return true;
  }

  async deleteShift() {
    this._shiftsService.deleteShift(this.shiftToEdit!).subscribe(() => {
      this._snackbarComponent.openSnackbar(
        'Shift deleted successfully!',
        'Close',
        'success-snackbar'
      );

      this._router.navigate(['/admin/shifts']);
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

  get f() {
    return this.updateShiftForm.controls;
  }
}
