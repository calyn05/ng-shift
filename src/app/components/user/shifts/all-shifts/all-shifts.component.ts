import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Shift } from 'src/app/shared/models/shift';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-all-shifts',
  templateUrl: './all-shifts.component.html',
  styleUrls: ['./all-shifts.component.css'],
})
export class AllShiftsComponent implements OnInit, OnDestroy {
  private _auth: Auth = inject(Auth);
  private _authService: AuthService = inject(AuthService);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);
  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _loader: LoaderService = inject(LoaderService);

  myShifts: Shift[] = [];
  dateStart!: string;
  dateEnd!: string;
  shiftLocation!: string;

  ngOnInit(): void {
    this._loader.setLoading(true);
    this.myShifts = [];
    this._userService.getCurrentUser().then(() => {
      this._userService.getUserData().subscribe((user) => {
        const username = user.username;
        this._shiftsService
          .getShiftsByUsername(username)
          .subscribe((shifts) => {
            this.myShifts = [];
            const myShifts = shifts.filter(
              (shift) => shift.username === username
            );
            myShifts.forEach((shift) => {
              this.myShifts.push(
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
        this._loader.setLoading(false);
      });
    });
  }
  constructor() {}

  setShiftToEdit(name: string) {
    this._shiftsService.setShiftToEdit(
      this.myShifts.find((shift) => shift.uniqueName === name) as Shift
    );
  }

  searchByLocation(location: string) {
    this.myShifts = [];
    this.shiftLocation = location;

    if (location === '') {
      location = 'all';
      this._router.navigate(['/shifts'], {
        relativeTo: this._route,
        queryParams: { location: 'all' },
      });
      this.ngOnInit();

      return;
    }

    this._loader.setLoading(true);
    this._router
      .navigate(['/shifts'], {
        queryParams: { location: location },
      })
      .then(
        () => {
          this._userService.getCurrentUser().then((user) => {
            this._userService.getUserData().subscribe((user) => {
              const username = user.username;
              this._shiftsService
                .getShiftsByUsername(username)
                .subscribe((shifts) => {
                  const myShifts = shifts.filter(
                    (shift) =>
                      shift.location
                        .toLowerCase()
                        .includes(location.toLowerCase()) &&
                      shift.username === username
                  );
                  myShifts.forEach((shift) => {
                    this.myShifts.push(
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
              this._loader.setLoading(false);
            });
          });
        },
        (error) => {
          this._snackbarComponent.openSnackbar(
            error.message,
            'Error',
            'error-snakbar'
          );
        }
      );
  }

  searchByDate(fromDate: string, toDate: string) {
    this.myShifts = [];
    this.dateStart = fromDate;
    this.dateEnd = toDate;

    if (fromDate === '' && toDate === '') {
      this._router.navigate(['/shifts'], {
        relativeTo: this._route,
        queryParams: { date: 'all' },
      });
      this.ngOnInit();

      return;
    }

    this._loader.setLoading(true);
    this._router
      .navigate(['/shifts'], {
        queryParams: { from: fromDate, to: toDate },
      })
      .then(
        () => {
          this._userService.getCurrentUser().then(() => {
            this._userService.getUserData().subscribe((user) => {
              const username = user.username;
              if (!username) return;
              this._shiftsService
                .getShiftsByUsername(username)
                .subscribe((shifts) => {
                  const myShifts = shifts.filter(
                    (shift) =>
                      shift.startDate >= fromDate &&
                      shift.endDate <= toDate &&
                      shift.username === username
                  );
                  myShifts.forEach((shift) => {
                    this.myShifts.push(
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
          });
        },
        (error) => {
          this._snackbarComponent.openSnackbar(
            error.message,
            'Error',
            'error-snakbar'
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.myShifts = [];
  }
}
