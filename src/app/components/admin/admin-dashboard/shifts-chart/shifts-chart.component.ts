import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-shifts-chart',
  templateUrl: './shifts-chart.component.html',
  styleUrls: ['./shifts-chart.component.css'],
})
export class ShiftsChartComponent implements OnInit {
  public chart!: Chart;

  // TODO: Replace this with data from the database
  data = [
    { id: 1, name: 'John', shifts: 5, hours: 65, income: 28 },
    { id: 2, name: 'Jane', shifts: 3, hours: 59, income: 48 },
    { id: 3, name: 'Joe', shifts: 4, hours: 80, income: 40 },
    { id: 4, name: 'Jack', shifts: 20, hours: 81, income: 19 },
    { id: 5, name: 'Jill', shifts: 10, hours: 56, income: 86 },
    { id: 6, name: 'Jim', shifts: 3, hours: 55, income: 27 },
  ];

  sortedData = this.sortData(this.data, 'shifts');

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('shiftsChart', {
      type: 'bar',
      data: {
        labels: this.sortedData.map((d) => d.name),
        datasets: [
          {
            label: 'Shifts',
            data: this.sortedData.map((d) => d.shifts),
            backgroundColor: '#3cba9f',
          },
          {
            label: 'Hours Worked',
            data: this.sortedData.map((d) => d.hours),
            backgroundColor: '#ffcc00',
          },
          {
            label: '($) Income / Hour',
            data: this.sortedData.map((d) => d.income),
            backgroundColor: 'lime',
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
