import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService) {}

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.pattern(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'
      ),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get username() {
    return this.registerForm.get('username');
  }

  register(email: string, password: string, username: string) {
    this.auth.register(email, password, username);
  }

  logout() {
    this.auth.logout();
  }

  // store user to firestore

  // register(email: string, password: string) {
  //   createUserWithEmailAndPassword(this.auth, email, password).then(
  //     (res) => console.log(res),
  //     (err) => console.log(err)
  //   );
  // }
}
