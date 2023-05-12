import { Component, OnInit, inject } from '@angular/core';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Shift } from 'src/app/shared/models/shift';

@Component({
  selector: 'app-upcoming-shift',
  templateUrl: './upcoming-shift.component.html',
  styleUrls: ['./upcoming-shift.component.css'],
})
export class UpcomingShiftComponent implements OnInit {
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);

  nextShift!: Shift | null | undefined;
  editShift!: Shift;

  ngOnInit(): void {
    this._userService.getCurrentUser().then((user) => {
      this._userService.getUserData().subscribe((res) => {
        const username = res.username;
        this._shiftsService.getNextShift(username).subscribe((res) => {
          if (res) {
            this.nextShift = new Shift(
              res.uniqueName,
              res.startDate,
              res.startTime,
              res.endDate,
              res.endTime,
              res.wage,
              res.location,
              res.description,
              res.username
            );
            this.editShift = this.nextShift;
          } else {
            this.nextShift = null;
          }
        });
      });
    });
  }

  setShiftToEdit(shift: Shift) {
    this._shiftsService.setShiftToEdit(shift);
  }
}
