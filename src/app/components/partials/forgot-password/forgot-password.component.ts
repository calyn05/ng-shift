import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordService } from 'src/app/shared/services/reset-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.css',
    '../../register/register.component.css',
    '../../admin/workers/worker-shifts/worker-shifts.component.css',
  ],
})
export class ForgotPasswordComponent implements OnInit {
  resetPasswordService: ResetPasswordService = inject(ResetPasswordService);

  forgotPasswordForm!: FormGroup;

  message: string =
    'Enter your email address and we will send you a link to reset your password.';

  constructor() {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  onSubmit(email: string) {
    this.resetPasswordService.resetPassword(email);
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  get emailInvalid() {
    return this.email?.invalid && this.email?.touched;
  }
}
