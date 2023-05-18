import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { dbUser } from 'src/app/shared/models/dbUser.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ShiftsService } from 'src/app/shared/services/shifts.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: [
    './workers.component.css',
    '../../user/shifts/all-shifts/all-shifts.component.css',
  ],
})
export class WorkersComponent implements OnInit, OnDestroy {
  private _adminService: AdminService = inject(AdminService);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _userService: UserService = inject(UserService);

  workers: dbUser[] = [];
  searchTerm!: string;

  ngOnInit(): void {
    this._adminService.getAuthUsers().subscribe(() => {
      this.getWorkers();
    });
  }

  getWorkers() {
    this.searchTerm = '';
    this._adminService.getWorkers().subscribe((workers) => {
      this.workers = workers;
      workers.forEach((worker) => {
        if (worker.id === undefined) return;
        this._shiftsService
          .getShiftsByUsername(worker.id)
          .subscribe((shifts) => {
            worker.shifts = shifts;
          });
      });
    });
  }

  searchWorker(username: string) {
    this.searchTerm = username;
    if (username === '') this.ngOnInit();
    this.workers.forEach((worker) => {
      const workerUsername = worker.id?.toLowerCase();
      if (workerUsername?.includes(username.toLowerCase())) {
        this.workers = this.workers.filter((worker) => {
          return worker.id?.toLowerCase().includes(username.toLowerCase());
        });
      }
    });
  }

  ngOnDestroy(): void {}
}
