import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from 'src/app/shared/password-match';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../register/register.component.css'],
})
export class LoginComponent {
  icon?: Array<string>;
  passIcon?: Array<string>;
  // 'sentiment_very_satisfied';

  constructor(private auth: AuthService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      PasswordValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
        hasNumber: true,
      }),
      PasswordValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
        hasCapitalCase: true,
      }),
      PasswordValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
        hasSmallCase: true,
      }),
      PasswordValidators.patternValidator(new RegExp('(?=.*[!@#$%^&*()_+])'), {
        hasSpecialCharacters: true,
      }),
    ]),
  });

  login(email: string, password: string) {
    this.auth.login(email, password);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
