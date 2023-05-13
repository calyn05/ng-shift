import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { dbUser } from 'src/app/shared/models/dbUser.model';
import { AdminService } from 'src/app/shared/services/admin.service';

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

  workers: dbUser[] = [];

  ngOnInit(): void {
    this._adminService.getWorkers().subscribe((workers) => {
      this.workers = workers;
      console.log(this.workers);
    });
  }

  ngOnDestroy(): void {}
}
