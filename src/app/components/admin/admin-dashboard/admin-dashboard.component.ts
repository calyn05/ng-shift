import { Component, OnInit, inject } from '@angular/core';
import { Chart } from 'chart.js';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _adminService: AdminService = inject(AdminService);
  chart!: Chart;

  data = [
    { month: 'January', income: 4500 },
    { month: 'February', income: 3000 },
    { month: 'March', income: 2000 },
    { month: 'April', income: 2800 },
    { month: 'May', income: 1800 },
    { month: 'June', income: 2400 },
    { month: 'July', income: 3500 },
  ];

  sortedData = this.sortData(this.data, 'income');

  ngOnInit(): void {
    console.log('Admin dashboard component initialized');
    this.createChart();
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
            backgroundColor: '#3cba9f',
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
          },
        },
      },
    });
  }

  sortData(data: any[], key: string) {
    return data.sort((a, b) => b[key] - a[key]);
  }
}
