import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Chart } from 'chart.js';
import { AuthService } from 'src/app/shared/services/auth.service';
import { dbUser } from 'src/app/shared/models/dbUser.model';
import { UserService } from 'src/app/shared/services/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { Shift } from 'src/app/shared/models/shift';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';
import { take } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader.service';
import {
  DialogComponent,
  DialogData,
} from '../../partials/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.css',
    '../../register/register.component.css',
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private _authService: AuthService = inject(AuthService);
  private _userService: UserService = inject(UserService);
  private _auth: Auth = inject(Auth);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _snackbar: MatSnackBar = inject(MatSnackBar);
  private _loader: LoaderService = inject(LoaderService);

  chart!: Chart;
  user!: User;
  email!: string;
  createdAt!: string | undefined;
  emailVerified!: boolean;

  pastWeekShifts: Shift[] = [];
  daysAndHours: { day: string; hours: number }[] = [];

  totalIncome: number = 0;
  incomeFutureShifts: number = 0;

  dbUser: dbUser = {
    username: '',
    firstName: '',
    lastName: '',
    age: 0,
    isAdmin: false,
  };

  constructor(
    private _snackbarComponent: SnackbarComponent,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._loader.setLoading(true);
    this.chart?.destroy();
    this.pastWeekShifts = [];

    this._auth.onAuthStateChanged((user) => {
      if (user) {
        this._userService.getUserData().subscribe((res) => {
          this.dbUser = res;
        });
      }
    });

    this._userService.getCurrentUser().then(() => {
      this._userService.getUserData().subscribe((user) => {
        const username = user.username;
        if (!username) {
          return;
        } else {
          this._shiftsService
            .getPastWeekShifts(username)
            .subscribe((shifts) => {
              this.pastWeekShifts = [];
              shifts.forEach((shift) => {
                this.pastWeekShifts.push(
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

              // Calculate  income
              this._shiftsService.getShifts().subscribe((shifts) => {
                this.incomeFutureShifts = 0;
                this.totalIncome = 0;
                shifts.forEach((shift) => {
                  if (shift.username === username) {
                    const shiftArr = new Array<Shift>();
                    shiftArr.push(
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
                    const today = new Date();
                    shiftArr.forEach((shift) => {
                      const shiftDate = new Date(shift.startDate);
                      shiftDate.setHours(Number(shift.startTime.split(':')[0]));

                      if (shiftDate > today) {
                        this.incomeFutureShifts +=
                          shift.shiftDurationHours() * shift.wage;
                        return;
                      } else {
                        this.totalIncome +=
                          shift.shiftDurationHours() * shift.wage;
                        return;
                      }
                    });
                  }
                });
              });

              // Total hours worked in the past week
              this.chart?.destroy();
              this.pastWeekShifts.forEach((shift) => {
                const day = new Date(
                  shift.startDate?.split(' ')[0]
                ).toLocaleDateString('en-US', {
                  weekday: 'long',
                });
                const hours = shift.shiftDurationHours();
                this.daysAndHours.push({ day: day as string, hours: hours });
              });
              this.createChart();
            });
          this._loader.setLoading(false);
        }
      });
    });

    this._auth.onAuthStateChanged((user) => {
      this._authService.isLoggedIn().subscribe((user) => {
        if (user) {
          this.user = this._userService.userLoggedIn() as User;
          this.email = this.user.email as string;
          this.createdAt = this.user.metadata?.creationTime;
          this.emailVerified = this.user.emailVerified;
        }
      });
    });
  }

  async createChart() {
    this.chart?.destroy();
    if (document.getElementById('hoursChart') !== null) {
      await this._userService.getCurrentUser().then(() => {
        this._userService.getUserData().subscribe((user) => {
          const username = user.username;
          if (!username) return;
          this.chart?.destroy();
          this.chart = new Chart('hoursChart', {
            type: 'bar',
            data: {
              labels: this.daysAndHours.map((day) => day.day),
              datasets: [
                {
                  label: 'Hours worked past 7 days',
                  data: this.daysAndHours.map((day) => day.hours),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                  ],
                  borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)',
                  ],
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        });
      });
    } else {
      return;
    }
  }

  openDialog(): void {
    const message = 'Are you sure you want to delete your account?';

    const data = new DialogData('Delete account', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser();
      }
      this._dialog.closeAll();
    });
  }

  deleteUser() {
    this._userService
      .getCurrentUser()
      .then(() => {
        this._loader.setLoading(true);
        this._userService.getUserData().subscribe((user) => {
          const username = user.username;
          this._userService
            .deleteUser()
            .pipe(take(1))
            .subscribe(() => {
              this._shiftsService.deleteAllShifts(username).subscribe(() => {
                this._auth
                  .signOut()
                  .then(() => {
                    this._router.navigate(['/']);
                  })
                  .catch((err) => {
                    this._loader.setLoading(false);
                    this._snackbarComponent.openSnackbar(
                      err.message
                        .toString()
                        .split(' ')[0]
                        .replace(':', '')
                        .trim(),
                      'error',
                      'error-snackbar'
                    );
                  });
              });
              this._loader.setLoading(false);
            });
        });
      })
      .catch((err) => {
        this._loader.setLoading(false);
        this._snackbarComponent.openSnackbar(
          err.message.toString().split(' ')[0].replace(':', '').trim(),
          'error',
          'error-snackbar'
        );
      });
  }

  ngOnDestroy() {
    this.chart?.destroy();
    this.pastWeekShifts = [];
  }
}
