import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  confirmPasswordReset,
  deleteUser,
  getAuth,
  sendPasswordResetEmail,
  updatePassword,
} from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { LoaderService } from './loader.service';
import { FirebaseErrors } from '../models/errors.parser';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private snackbarComponent: SnackbarComponent,
    private loader: LoaderService
  ) {}

  resetPassword(email: string) {
    this.loader.setLoading(true);
    const userDatabase = collection(this.firestore, 'users');
    from(getDocs(userDatabase)).subscribe((res) => {
      const emails = res.docs.map((doc) => doc.data()['email']);
      if (emails.includes(email)) {
        sendPasswordResetEmail(this.auth, email)
          .then(() => {
            this.snackbarComponent.openSnackbar(
              'Password reset email sent! Check your inbox.',
              'Success',
              'success-snackbar'
            );
          })
          .then(() => {
            this.router.navigate(['/login']);
          })
          .catch((error) => {
            this.snackbarComponent.openSnackbar(
              FirebaseErrors.Parse(error.code),
              'Error',
              'error-snackbar'
            );
            this.loader.setLoading(false);
          });
      } else {
        this.snackbarComponent.openSnackbar(
          'No user found with this email address!',
          'Error',
          'error-snackbar'
        );
        this.loader.setLoading(false);
      }
    });
  }

  resetPasswordWithCode(code: string, password: string) {
    this.loader.setLoading(true);

    const auth = getAuth();

    confirmPasswordReset(auth, code, password)
      .then(() => {
        this.snackbarComponent.openSnackbar(
          'Password reset successfully!',
          'Success',
          'success-snackbar'
        );
      })
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        this.snackbarComponent.openSnackbar(
          FirebaseErrors.Parse(error.code),
          'Error',
          'error-snackbar'
        );
        this.loader.setLoading(false);
      });
  }

  updatePassword(password: string) {
    this.loader.setLoading(true);

    const user = this.auth.currentUser;

    updatePassword(user as User, password)
      .then(() => {
        this.snackbarComponent.openSnackbar(
          'Password updated successfully!',
          'Success',
          'success-snackbar'
        );
        this.router.navigate(['/profile']);
      })
      .catch((error) => {
        this.snackbarComponent.openSnackbar(
          FirebaseErrors.Parse(error.code),
          'Error',
          'error-snackbar'
        );
        this.loader.setLoading(false);
      });
  }
}
