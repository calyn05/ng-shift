import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { dbUser } from 'src/app/shared/models/dbUser.model';
import { AdminService } from 'src/app/shared/services/admin.service';

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

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
