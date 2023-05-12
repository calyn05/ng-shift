import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordValidators } from 'src/app/shared/validators/password-match';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../register/register.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _loader: LoaderService
  ) {}

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

  ngOnInit(): void {
    this._loader.setLoading(false);
  }

  login(email: string, password: string) {
    this._loader.setLoading(true);
    this.auth.login(email, password);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
