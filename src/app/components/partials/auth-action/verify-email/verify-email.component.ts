import { Component, inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: [
    './verify-email.component.css',
    '../../../user/shifts/add-shift/add-shift.component.css',
    '../../../register/register.component.css',
  ],
})
export class VerifyEmailComponent {
  private _userService: UserService = inject(UserService);
  private _authService: AuthService = inject(AuthService);
  private _auth: Auth = inject(Auth);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);

  value: string = '';

  code!: string;

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.code = params['oobCode'];
    });

    this._auth.onAuthStateChanged((user) => {
      if (user) {
        this.value = user.email as string;
      }
    });

    if (this.code) {
      this._authService.confirmEmailCode(this.code);
    }
  }

  get email(): string {
    return this._userService.userLoggedIn()?.email as string;
  }

  sendVerificationEmail() {
    this._authService.sendVerificationEmail();
  }
}
