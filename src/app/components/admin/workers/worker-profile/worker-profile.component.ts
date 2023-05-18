import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import {
  DialogComponent,
  DialogData,
} from 'src/app/components/partials/dialog/dialog.component';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { dbUser } from 'src/app/shared/models/dbUser.model';
import { Shift } from 'src/app/shared/models/shift';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-worker-profile',
  templateUrl: './worker-profile.component.html',
  styleUrls: [
    './worker-profile.component.css',
    '../../../user/profile/profile.component.css',
    '../../../register/register.component.css',
  ],
})
export class WorkerProfileComponent implements OnInit, OnDestroy {
  private _authService: AuthService = inject(AuthService);
  private _userService: UserService = inject(UserService);
  private _auth: Auth = inject(Auth);
  private _adminService: AdminService = inject(AdminService);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _loader: LoaderService = inject(LoaderService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _dialog: MatDialog = inject(MatDialog);

  chart!: Chart;
  user!: User | null | undefined;

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

  ngOnInit(): void {
    this.chart?.destroy();
    this.pastWeekShifts = [];

    this._route.params.subscribe((params) => {
      const username = params['id'];

      this._adminService.getWorker(username).subscribe((user) => {
        this.dbUser.age = user[0].age;
        this.dbUser.firstName = user[0].firstName;
        this.dbUser.lastName = user[0].lastName;
        this.dbUser.username = username;
        if (user[0].uid) this.getAuthUser(user[0].uid);
        this._shiftsService.getPastWeekShifts(username).subscribe((shifts) => {
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
                    this.totalIncome += shift.shiftDurationHours() * shift.wage;
                    return;
                  }
                });
              }
            });

            this.daysAndHours = [];
            this.pastWeekShifts.forEach((shift) => {
              const day = new Date(
                shift.startDate.split(' ')[0]
              ).toLocaleDateString('en-US', { weekday: 'long' });
              const hours = shift.shiftDurationHours();
              this.daysAndHours.push({ day, hours });
            });
            this.createChart();
          });
        });
      });
    });
  }

  getAuthUser(uid: string) {
    this._adminService.getAuthUser(uid).subscribe((user) => {
      this.user = user;
    });
  }

  openDialog(): void {
    const message = 'Are you sure you want to delete this user?';

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
    this._adminService.getWorker(this.dbUser.username).subscribe((user) => {
      this._adminService.deleteWorker(this.dbUser.username).subscribe(() => {
        this._shiftsService
          .deleteAllShifts(this.dbUser.username)
          .subscribe(() => {
            this._router.navigate(['/admin/workers']).then(() => {
              this._adminService.deleteAuthUser(user[0].uid!).subscribe(() => {
                this._snackbarComponent.openSnackbar(
                  'User deleted successfully',
                  'Close',
                  'success-snackbar'
                );
              });
            });
          });
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

              plugins: {
                title: {
                  display: true,
                  text: 'Hours worked past 7 days',

                  font: {
                    size: 16,

                    family: 'Roboto',

                    weight: 'bold',

                    lineHeight: 1.2,
                  },
                },

                legend: {
                  display: false,

                  labels: {
                    font: {
                      size: 20,

                      family: 'Roboto',
                    },
                  },
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

  ngOnDestroy(): void {
    this.totalIncome = 0;
    this.incomeFutureShifts = 0;

    this.dbUser = {
      username: '',
      firstName: '',
      lastName: '',
      age: 0,
      isAdmin: false,
    };

    this.chart?.destroy();

    this.pastWeekShifts = [];

    this.daysAndHours = [];

    this.user = null;
  }
}
