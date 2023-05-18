import { NgZone, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

export const isUserGuard = async () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const zone = inject(NgZone);
  await userService
    .getCurrentUser()
    .then(() => {
      userService.getUserData().subscribe((user) => {
        if (!user.isAdmin) {
          return true;
        } else {
          zone.run(() => {
            router.navigate(['/admin/dashboard']);
          });
          return false;
        }
      });
    })
    .catch((err) => {
      console.log(err);
      router.navigate(['/login']);
      return false;
    });
};
