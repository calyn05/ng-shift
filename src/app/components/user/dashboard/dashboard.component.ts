import { Component, OnInit, inject } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);
  private _loader: LoaderService = inject(LoaderService);

  earningsPerMonth!: { month: string; earnings: number }[];

  ngOnInit(): void {
    this._loader.setLoading(true);
    this._userService.getCurrentUser().then(() => {
      this._userService.getUserData().subscribe((user) => {
        const username = user.username;
        this._shiftsService
          .getEarningsPerMonth(username)
          .subscribe((shifts) => {
            this.earningsPerMonth = shifts;
          });
        this._loader.setLoading(false);
      });
    });

    this.bestMonth();
  }

  bestMonth(): { month: string; earnings: number } {
    let bestMonth = { month: '', earnings: 0 };
    for (let i = 0; i < this.earningsPerMonth?.length; i++) {
      if (this.earningsPerMonth[i].earnings > bestMonth.earnings) {
        bestMonth = this.earningsPerMonth[i];
      }
    }
    return bestMonth;
  }
}
