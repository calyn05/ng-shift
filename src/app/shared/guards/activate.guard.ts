import { inject, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

export const activateGuard = async () => {
  const auth = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);
  const zone = inject(NgZone);

  await userService
    .getCurrentUser()
    .then(() => {
      auth.isLoggedIn().subscribe((res) => {
        if (res) {
          return true;
        } else {
          zone.run(() => {
            router.navigate(['/login']);
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
