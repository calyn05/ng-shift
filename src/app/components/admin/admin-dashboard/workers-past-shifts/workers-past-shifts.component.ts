import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { dbUser } from 'src/app/shared/models/dbUser.model';
import { Shift } from 'src/app/shared/models/shift';
import { AdminService } from 'src/app/shared/services/admin.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';

@Component({
  selector: 'app-workers-past-shifts',
  templateUrl: './workers-past-shifts.component.html',
  styleUrls: [
    './workers-past-shifts.component.css',
    '../../../user/dashboard/upcoming-shift/upcoming-shift.component.css',
  ],
})
export class WorkersPastShiftsComponent implements OnInit, OnDestroy {
  private _adminService: AdminService = inject(AdminService);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _loader: LoaderService = inject(LoaderService);

  shifts: Shift[] = [];
  week!: Date;

  ngOnInit(): void {
    this._loader.setLoading(true);
    this.getPastWeekShifts();
  }

  getPastWeekShifts(): void {
    this.shifts = [];
    this._shiftsService.getShifts().subscribe((shifts) => {
      const today = new Date();
      const pastWeek = new Date(today);
      pastWeek.setDate(pastWeek.getDate() - 7);
      this.week = pastWeek;

      const lastWeekShifts = shifts.filter((shift) => {
        const shiftDate = new Date(shift.startDate);
        return shiftDate >= pastWeek && shiftDate < today;
      });

      lastWeekShifts.sort((a, b) => {
        const aDate = new Date(a.startDate);
        const bDate = new Date(b.startDate);
        return bDate.getTime() - aDate.getTime();
      });

      lastWeekShifts.forEach((shift) => {
        this.shifts.push(
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
      this._loader.setLoading(false);
    });
  }

  setShiftToEdit(name: string) {
    this._shiftsService.setShiftToEdit(
      this.shifts.find((shift) => shift.uniqueName === name) as Shift
    );
  }

  ngOnDestroy(): void {}
}
