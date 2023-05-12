import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit, OnDestroy {
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);
  private _authService: AuthService = inject(AuthService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  public chart!: Chart;
  public months: string[] = [];
  private dollarIncome: number[] = [];
  private euroIncome: number[] = [];
  private poundIncome: number[] = [];

  constructor(private _snackbarComponent: SnackbarComponent) {}

  ngOnInit(): void {
    this._userService.getCurrentUser().then(() => {
      this._userService.getUserData().subscribe((user) => {
        const username = user.username;
        if (
          !username &&
          !this._route.snapshot.url.toString().includes('dashboard')
        )
          return;
        this.chart?.destroy();
        this._shiftsService.getEarningsPerMonth(username).subscribe((res) => {
          if (res.length === 0) {
            return;
          }
          this.months = res.map((month) => month.month);
          this.dollarIncome = res.map((month) => month.earnings);
          this.euroIncome = res.map((month) => month.earnings * 0.85);
          this.poundIncome = res.map((month) => month.earnings * 0.73);

          if (this.months === res.map((month) => month.month)) {
            return;
          }
          this.createChart();
        });
      });
    });
  }

  async createChart() {
    this.chart?.destroy();
    if (document.getElementById('incomeChart') !== null) {
      await this._userService.getCurrentUser().then(() => {
        this._userService.getUserData().subscribe((user) => {
          const username = user.username;
          if (!username) return;
          this.chart = new Chart('incomeChart', {
            type: 'bar',
            data: {
              labels: this.months,
              datasets: [
                {
                  label: 'Dollars',
                  data: this.dollarIncome,
                  backgroundColor: '#348d1d',
                },
                {
                  label: 'EURO',
                  data: this.euroIncome,
                  backgroundColor: '#a35d17',
                },
                {
                  label: 'Pounds',
                  data: this.poundIncome,
                  backgroundColor: '#7d5ac9',
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              aspectRatio: 1,
              scales: {
                y: {
                  beginAtZero: true,

                  ticks: {
                    callback: function (value: any) {
                      return value;
                    },
                  },
                },
              },
            },
          });
        });
      }),
        (err: Error) => {
          this._snackbarComponent.openSnackbar(
            err.message,
            'error',
            'error-snackbar'
          );
        };
    } else {
      return;
    }
  }

  get isLoggedIn() {
    return this._authService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
