import { Component, HostListener, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateValidatorDirective } from 'src/app/shared/validators/date-validator.directive';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Shift } from 'src/app/shared/models/shift';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { UniqueNameDirective } from 'src/app/shared/validators/unique-name.directive';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: [
    './add-shift.component.css',
    '../../../register/register.component.css',
  ],
})
export class AddShiftComponent implements OnInit {
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);
  private _snackbar: MatSnackBar = inject(MatSnackBar);
  private _router: Router = inject(Router);
  private _loader: LoaderService = inject(LoaderService);

  @HostListener('document:click', ['$event'])
  clickout(event: { target: { id: string } }) {
    if (event.target.id !== 'location') {
      this.filteredLocations = [];
    }
  }

  addShiftForm!: FormGroup;
  isSubmitted: boolean = false;
  locations: string[] = [];
  filteredLocations: string[] = [];

  constructor(private _snackbarComponent: SnackbarComponent) {}

  ngOnInit(): void {
    this._loader.setLoading(true);
    this._userService.getCurrentUser().then(() => {
      this._userService.getUserData().subscribe((res) => {
        const username = res.username;
        this._shiftsService.getShiftsByUsername(username).subscribe((res) => {
          res.forEach((shift) => {
            this.locations.push(shift.location);
          });
        });
        this._loader.setLoading(false);
      });
    });

    this.addShiftForm = new FormGroup(
      {
        startDate: new FormControl(null, [Validators.required]),
        startTime: new FormControl(null, [Validators.required]),
        endDate: new FormControl(null, [Validators.required]),
        endTime: new FormControl(null, [Validators.required]),
        wage: new FormControl(null, [Validators.required]),
        location: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        uniqueName: new FormControl(
          null,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20),
          ],
          [
            UniqueNameDirective.uniqueName(
              this._shiftsService,
              this._userService
            ),
          ]
        ),
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
  }

  canExit(): boolean {
    if (this.addShiftForm.dirty && !this.isSubmitted) {
      return false;
    } else {
      return true;
    }
  }

  onLocationInput(event: any): void {
    const locations = new Set(this.locations);
    const filteredLocations = Array.from(locations).filter((location) =>
      location.toLowerCase().includes(event.target.value.toLowerCase())
    );
    this.filteredLocations = filteredLocations;
  }

  onLocationFocus(): void {
    const locations = new Set(this.locations);
    this.filteredLocations = Array.from(locations);
    if (
      this.locationInput?.errors?.['required'] &&
      this.filteredLocations.length > 0
    ) {
      this.locationInput.setErrors(null);
    }

    if (this.filteredLocations.length > 0) {
      this._snackbarComponent.openSnackbar(
        'Select a location! Or, type a new one!',
        'Close',
        'info-snackbar'
      );
    }
  }

  async addShift(addShiftForm: FormGroup) {
    const newShift: Shift = new Shift(
      addShiftForm.value.uniqueName,
      addShiftForm.value.startDate,
      addShiftForm.value.startTime,
      addShiftForm.value.endDate,
      addShiftForm.value.endTime,
      Number(addShiftForm.value.wage),
      addShiftForm.value.location,
      addShiftForm.value.description
    );
    this._loader.setLoading(true);
    await this._shiftsService
      .addShift(newShift)
      .then(
        (res) => {
          this._snackbarComponent.openSnackbar(
            'Shift added successfully',
            'Close',
            'success-snackbar'
          );
          this.isSubmitted = true;
        },
        (err) => {
          this._loader.setLoading(false);
          this._snackbarComponent.openSnackbar(err, 'Close', 'error-snackbar');
        }
      )
      .then(() => {
        this.addShiftForm.reset();
      })
      .finally(() => {});
  }

  resetForm() {
    this.addShiftForm.reset();
  }

  showErrors(): void {
    if (this.startDateInputError) {
      this._snackbarComponent.openSnackbar(
        "End date can't be before start date",
        'Close',
        'error-snackbar'
      );
    } else if (this.startTimeInputError) {
      this._snackbarComponent.openSnackbar(
        "End time can't be before start time",
        'Close',
        'error-snackbar'
      );
    } else {
      this._snackbarComponent.closeSnackbar();
    }
  }

  selectLocation(location: string) {
    this.addShiftForm.patchValue({
      location: location,
    });
    this.filteredLocations = [];
  }

  get startDateInput() {
    return this.addShiftForm.get('startDate');
  }

  get startTimeInput() {
    return this.addShiftForm.get('startTime');
  }

  get endDateInput() {
    return this.addShiftForm.get('endDate');
  }

  get endTimeInput() {
    return this.addShiftForm.get('endTime');
  }

  get wageInput() {
    return this.addShiftForm.get('wage');
  }

  get locationInput() {
    return this.addShiftForm.get('location');
  }

  get uniqueNameInput() {
    return this.addShiftForm.get('uniqueName');
  }

  get descriptionInput() {
    return this.addShiftForm.get('description');
  }

  get startDateInputError() {
    return this.addShiftForm.get('endDate')?.errors ? ['startDate'] : null;
  }

  get startTimeInputError() {
    return this.addShiftForm.get('endTime')?.errors ? ['startTime'] : null;
  }

  get uniqueNameError() {
    return this.addShiftForm.get('uniqueName')?.errors ? ['uniqueName'] : null;
  }
}
