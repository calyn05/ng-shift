import { Component, OnInit, inject } from '@angular/core';
import { Chart } from 'chart.js';
import { Shift } from 'src/app/shared/models/shift';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _adminService: AdminService = inject(AdminService);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _loader: LoaderService = inject(LoaderService);

  chart!: Chart;

  shifts!: Shift[];
  data!: { month: string; income: number }[];
  sortedData!: { month: string; income: number }[];
  bestMonth = { month: '', income: 0 };

  ngOnInit(): void {
    this._loader.setLoading(true);

    this._shiftsService.getShifts().subscribe((shifts) => {
      const pastShifts = shifts.filter(
        (shift) => shift.startDate < new Date().toISOString().split('T')[0]
      );

      this.shifts = pastShifts.map(
        (shift) =>
          new Shift(
            shift.uniqueName,
            shift.startDate,
            shift.startTime,
            shift.endDate,
            shift.endTime,
            shift.wage,
            shift.location,
            shift.description
          )
      );
      this.getEarningsPerMonth();

      this._loader.setLoading(false);
    });
  }

  getEarningsPerMonth(): void {
    const earningsPerMonth: { month: string; income: number }[] = [];

    this.shifts.forEach((shift) => {
      const month = new Date(shift.startDate).toLocaleString('default', {
        month: 'long',
      });
      const income = shift.totalShiftWage();

      const monthIndex = earningsPerMonth.findIndex((e) => e.month === month);

      if (monthIndex === -1) {
        earningsPerMonth.push({ month, income });
      } else {
        earningsPerMonth[monthIndex].income += income;
      }
    });

    this.data = earningsPerMonth;
    this.sortedData = this.sortData(this.data, 'income');
    this.createChart();
    this.getBestMonth();
  }

  getBestMonth(): void {
    this.bestMonth = this.sortedData[0];
  }

  createChart() {
    this.chart = new Chart('earningsChart', {
      type: 'bar',
      data: {
        labels: this.sortedData.map((d) => d.month),
        datasets: [
          {
            label: 'Income',
            data: this.sortedData.map((d) => d.income),
            backgroundColor: '#CCCCFF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        font: {
          size: 50,
        },
        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              callback: function (value: any) {
                return '$' + value;
              },
            },
          },
        },
      },
    });
    this._loader.setLoading(false);
  }

  sortData(data: any[], key: string) {
    return data.sort((a, b) => b[key] - a[key]);
  }
}
