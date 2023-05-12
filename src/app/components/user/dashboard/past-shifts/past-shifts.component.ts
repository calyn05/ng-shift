import { Component, OnInit, inject } from '@angular/core';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Shift } from 'src/app/shared/models/shift';

@Component({
  selector: 'app-past-shifts',
  templateUrl: './past-shifts.component.html',
  styleUrls: [
    './past-shifts.component.css',
    '../upcoming-shift/upcoming-shift.component.css',
  ],
})
export class PastShiftsComponent implements OnInit {
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);

  pastShifts: Shift[] = [];
  week!: Date;

  ngOnInit(): void {
    this._userService.getCurrentUser().then(() => {
      this._userService.getUserData().subscribe((user) => {
        const username = user.username;

        this._shiftsService.getPastWeekShifts(username).subscribe((shifts) => {
          this.pastShifts = shifts.map((shift) => {
            this.week = new Date(shift.startDate);
            return new Shift(
              shift.uniqueName,
              shift.startDate,
              shift.startTime,
              shift.endDate,
              shift.endTime,
              shift.wage,
              shift.location,
              shift.description,
              shift.username
            );
          });
        });
      });
    });
  }

  setShiftToEdit(name: string) {
    this._shiftsService.setShiftToEdit(
      this.pastShifts.find((shift) => shift.uniqueName === name) as Shift
    );
  }
}
