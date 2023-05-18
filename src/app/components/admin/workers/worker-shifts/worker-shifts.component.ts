import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { Shift } from 'src/app/shared/models/shift';
import { AdminService } from 'src/app/shared/services/admin.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-worker-shifts',
  templateUrl: './worker-shifts.component.html',
  styleUrls: [
    './worker-shifts.component.css',
    '../../../user/shifts/all-shifts/all-shifts.component.css',
  ],
})
export class WorkerShiftsComponent implements OnInit, OnDestroy {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);
  private _adminService: AdminService = inject(AdminService);
  private _loader: LoaderService = inject(LoaderService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);

  shifts: Shift[] = [];
  fromDate!: string;
  toDate!: string;
  locationTerm!: string;
  worker!: string;
  firstName!: string;
  lastName!: string;

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.worker = params['id'];
    });

    this._adminService.getWorker(this.worker).subscribe((worker) => {
      this.firstName = worker[0].firstName;
      this.lastName = worker[0].lastName;
      this._shiftsService
        .getShiftsByUsername(worker[0].id!)
        .subscribe((shifts) => {
          this.shifts = [];
          shifts.forEach((shift) => {
            this.shifts.push(
              new Shift(
                shift.uniqueName,
                shift.startDate,
                shift.startTime,
                shift.endDate,
                shift.endTime,
                shift.wage,
                shift.location,
                shift.description,
                shift.username
              )
            );
          });
        });
    });
  }

  searchByDate(from: string, to: string) {
    this._loader.setLoading(true);
    this.fromDate = from;
    this.toDate = to;
    this.locationTerm = '';

    if (from === '' || to === '') {
      this._snackbarComponent.openSnackbar(
        'Please select a start and end date',
        'Close',
        'error-snackbar'
      );
      this._loader.setLoading(false);
      return;
    }

    this._shiftsService.getShiftsByDate(from, to).subscribe((shifts) => {
      this.shifts = [];
      shifts.forEach((shift) => {
        if (shift !== null) {
          if (shift.username === this.worker) {
            this.shifts.push(
              new Shift(
                shift.uniqueName,
                shift.startDate,
                shift.startTime,
                shift.endDate,
                shift.endTime,
                shift.wage,
                shift.location,
                shift.description,
                shift.username
              )
            );
          }
        }
        return;
      });
      this._loader.setLoading(false);
    });
  }

  searchByLocation(location: string) {
    this._loader.setLoading(true);
    this.locationTerm = location;
    this.fromDate = '';
    this.toDate = '';

    if (location === '') {
      this._snackbarComponent.openSnackbar(
        'Please enter a location',
        'Close',
        'error-snackbar'
      );
      this._loader.setLoading(false);
      return;
    }

    this._shiftsService.getShiftsByUsername(this.worker).subscribe((shifts) => {
      this.shifts = [];
      shifts.forEach((shift) => {
        if (shift !== null) {
          if (shift.location.toLowerCase().includes(location.toLowerCase())) {
            this.shifts.push(
              new Shift(
                shift.uniqueName,
                shift.startDate,
                shift.startTime,
                shift.endDate,
                shift.endTime,
                shift.wage,
                shift.location,
                shift.description,
                shift.username
              )
            );
          }
        }
        return;
      });
      this._loader.setLoading(false);
    });
  }

  setShiftToEdit(shift: string) {
    this._shiftsService.setShiftToEdit(
      this.shifts.find((s) => s.uniqueName === shift) as Shift
    );
  }

  ngOnDestroy(): void {}
}
