import { Component, OnInit, inject } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { take } from 'rxjs';
import { ShiftsService } from 'src/app/shared/services/shifts.service';

@Component({
  selector: 'app-shifts-chart',
  templateUrl: './shifts-chart.component.html',
  styleUrls: ['./shifts-chart.component.css'],
})
export class ShiftsChartComponent implements OnInit {
  private _shiftsService: ShiftsService = inject(ShiftsService);

  public chart!: Chart;
  public incomeChart!: Chart;
  public hoursChart!: Chart;

  data!: {
    name: string | undefined;
    shifts: number;
    hours: number;
    income: number;
  }[];
  pastWeek!: number;

  sortedData!: {
    name: string;
    shifts: number;
    hours: number;
    income: number;
  }[];

  ngOnInit(): void {
    this.data = [];
    this.sortedData = [];
    this.getLastWeekShiftsPerWorker();
  }

  getLastWeekShiftsPerWorker() {
    this._shiftsService
      .getShifts()
      .pipe(take(1))
      .subscribe((shifts) => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        this.pastWeek = lastWeek.getTime();

        const lastWeekShifts = shifts.filter((shift) => {
          const shiftDate = new Date(shift.startDate);
          return shiftDate >= lastWeek && shiftDate < today;
        });

        const workers = lastWeekShifts.map((shift) => shift.username);
        const uniqueWorkers = [...new Set(workers)];

        const data = uniqueWorkers.map((worker) => {
          const workerShifts = lastWeekShifts.filter(
            (shift) => shift.username === worker
          );
          const shifts = workerShifts.length;

          const hours = workerShifts.reduce((acc, curr) => {
            const start = new Date(curr.startDate + 'T' + curr.startTime);
            const end = new Date(curr.endDate + 'T' + curr.endTime);

            const diff = end.getTime() - start.getTime();
            const hours = diff / (1000 * 60 * 60);
            return acc + hours;
          }, 0);

          const income = workerShifts.reduce((acc, curr) => {
            const start = new Date(curr.startDate + 'T' + curr.startTime);
            const end = new Date(curr.endDate + 'T' + curr.endTime);
            const diff = end.getTime() - start.getTime();
            const hours = diff / (1000 * 60 * 60);
            const totalWage = curr.wage * hours;
            return acc + totalWage;
          }, 0);

          return {
            name: worker,
            shifts,
            hours,
            income,
          };
        });
        this.data = data;

        this.sortedData = this.sortData(this.data, 'shifts');

        this.chart?.destroy();
        this.incomeChart?.destroy();
        this.hoursChart?.destroy();
        this.createShiftsChart();
        this.createIncomeChart();
        this.createHoursChart();
      });
  }

  createShiftsChart() {
    this.chart = new Chart('shiftsChart', {
      type: 'bar',
      data: {
        labels: this.sortedData.map((d) => d.name),
        datasets: [
          {
            label: 'Shifts',
            data: this.sortedData.map((d) => d.shifts),
            backgroundColor: '#9370DB',
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
              callback: function (value: number | string) {
                return value;
              },
            },
          },
        },
      },
    });
  }

  createIncomeChart() {
    this.incomeChart = new Chart('incomeChart', {
      type: 'bar',
      data: {
        labels: this.sortedData.map((d) => d.name),
        datasets: [
          {
            label: 'Income',
            data: this.sortedData.map((d) => d.income),
            backgroundColor: '#E6E6FA',
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
              callback: function (value: number | string) {
                return '$' + value;
              },
            },
          },
        },
      },
    });
  }

  createHoursChart() {
    this.hoursChart = new Chart('hoursChart', {
      type: 'bar',
      data: {
        labels: this.sortedData.map((d) => d.name),
        datasets: [
          {
            label: 'Hours',
            data: this.sortedData.map((d) => d.hours),
            backgroundColor: '#C3B1E1',
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
              callback: function (value: number | string) {
                return value;
              },
            },
          },
        },
      },
    });
  }

  sortData(data: any[], sortKey: string) {
    return data.sort((a, b) => b[sortKey] - a[sortKey]);
  }
}
