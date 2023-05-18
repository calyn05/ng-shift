import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shift } from 'src/app/shared/models/shift';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';

@Component({
  selector: 'app-admin-shifts',
  templateUrl: './admin-shifts.component.html',
  styleUrls: [
    './admin-shifts.component.css',
    '../../user/shifts/all-shifts/all-shifts.component.css',
  ],
})
export class AdminShiftsComponent implements OnInit, OnDestroy {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);
  private _loader: LoaderService = inject(LoaderService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);

  searchBy: string = 'search_by_date';

  shifts: Shift[] = [];
  startDate!: string;
  endDate!: string;
  location!: string;
  worker!: string;

  constructor() {}

  ngOnInit(): void {
    this._loader.setLoading(true);

    this._userService.getCurrentUser().then(() => {
      this._shiftsService.getShifts().subscribe((shifts) => {
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
        this._loader.setLoading(false);
      });
    });
  }

  setShiftToEdit(name: string) {
    this._shiftsService.setShiftToEdit(
      this.shifts.find((shift) => shift.uniqueName === name) as Shift
    );
  }

  searchByDate(fromDate: string, toDate: string) {
    this._loader.setLoading(true);
    this.shifts = [];
    this.startDate = fromDate;
    this.endDate = toDate;
    this.worker = '';
    this.location = '';

    if (fromDate == '' && toDate == '') {
      this._router.navigate(['/admin/shifts'], {
        relativeTo: this._route,
        queryParams: { date: 'all' },
      });
      this.ngOnInit();

      return;
    }

    this._router
      .navigate(['/admin/shifts'], {
        relativeTo: this._route,
        queryParams: { date: `${fromDate} - ${toDate}` },
      })
      .then(
        () => {
          this._shiftsService
            .getShiftsByDate(fromDate, toDate)
            .subscribe((shifts) => {
              shifts.forEach((shift) => {
                if (shift !== null) {
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
                return;
              });

              this._loader.setLoading(false);
            });
        },
        (error) => {
          this._loader.setLoading(false);
          this._snackbarComponent.openSnackbar(
            error.message,
            'Close',
            'error-snackbar'
          );
        }
      );
  }

  searchByLocation(location: string) {
    this._loader.setLoading(true);
    this.shifts = [];
    this.location = location;
    this.startDate = '';
    this.endDate = '';
    this.worker = '';

    if (location == '') {
      this._router.navigate(['/admin/shifts'], {
        relativeTo: this._route,
        queryParams: { location: 'all' },
      });
      this.ngOnInit();

      return;
    }

    this._router
      .navigate(['/admin/shifts'], {
        relativeTo: this._route,
        queryParams: { location: location },
      })
      .then(
        () => {
          this._shiftsService.getShifts().subscribe((shifts) => {
            shifts.forEach((shift) => {
              if (
                shift !== null &&
                shift.location.toLowerCase().includes(location.toLowerCase())
              ) {
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
              return;
            });

            this._loader.setLoading(false);
          });
        },
        (error) => {
          this._loader.setLoading(false);
          this._snackbarComponent.openSnackbar(
            error.message,
            'Close',
            'error-snackbar'
          );
        }
      );
  }

  searchByWorker(worker: string) {
    this._loader.setLoading(true);
    this.shifts = [];
    this.worker = worker;
    this.location = '';
    this.startDate = '';

    if (worker == '') {
      this._router.navigate(['/admin/shifts'], {
        relativeTo: this._route,
        queryParams: { worker: 'all' },
      });
      this.ngOnInit();

      return;
    }

    this._router
      .navigate(['/admin/shifts'], {
        relativeTo: this._route,
        queryParams: { worker: worker },
      })
      .then(
        () => {
          this._shiftsService.getShifts().subscribe((shifts) => {
            shifts.forEach((shift) => {
              if (
                shift !== null &&
                shift.username?.toLowerCase().includes(worker.toLowerCase())
              ) {
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
              return;
            });

            this._loader.setLoading(false);
          });
        },
        (error) => {
          this._loader.setLoading(false);
          this._snackbarComponent.openSnackbar(
            error.message,
            'Close',
            'error-snackbar'
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.shifts = [];
  }
}
