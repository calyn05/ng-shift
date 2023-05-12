import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-admin-shifts',
  templateUrl: './admin-shifts.component.html',
  styleUrls: [
    './admin-shifts.component.css',
    '../../user/shifts/all-shifts/all-shifts.component.css',
  ],
})
export class AdminShiftsComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  searchBy: string = 'search_by_date';
  constructor() {}

  ngOnInit(): void {}
}
