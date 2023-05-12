import { Injectable, inject } from '@angular/core';
import { Auth, User, deleteUser } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { dbUser } from '../models/dbUser.model';
import { Observable, from, of, take } from 'rxjs';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { LoaderService } from './loader.service';
import { FirebaseErrors } from '../models/errors.parser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private _loader: LoaderService = inject(LoaderService);
  private _router: Router = inject(Router);

  user!: dbUser;

  constructor(private _snackbarComponent: SnackbarComponent) {}

  userLoggedIn(): User | null {
    return this.auth.currentUser as User;
  }

  getUserEmail(): string {
    return this.userLoggedIn()?.email as string;
  }

  getUserData() {
    return from(this.getUserDataPromise()) as Observable<dbUser>;
  }

  getUserDataPromise() {
    return new Promise((resolve, reject) => {
      const userDatabase = collection(this.firestore, 'users');
      const userEmail = this.getUserEmail();

      const userRef = collectionData(userDatabase, { idField: 'id' });

      const user = userRef.subscribe((res) => {
        const user = res.find((user) => user['email'] === userEmail);
        if (user) {
          const username = user['id'];
          const firstName = user['firstName'];
          const lastName = user['lastName'];
          const age = user['age'];
          const isAdmin = user['isAdmin'];

          this.user = {
            username,
            firstName,
            lastName,
            age,
            isAdmin,
          };
          resolve(this.user);
        }
      });

      if (!user) {
        reject('Failed to fetch user data. Please try again later.');
      }
    });
  }

  // Delete firebase auth user

  deleteUser(): Observable<void> {
    return from(this.deleteUserPromise()) as Observable<void>;
  }

  deleteUserPromise() {
    return new Promise((resolve, reject) => {
      const user = this.userLoggedIn();

      if (user) {
        const userUid = user.uid;

        deleteUser(user)
          .then(() => {
            this.deleteUserData(userUid).subscribe(() => {
              this._snackbarComponent.openSnackbar(
                'User deleted successfully.',
                'Close',
                'success-snackbar'
              );
            });
            resolve('User deleted successfully.');
          })
          .catch((error) => {
            this._snackbarComponent.openSnackbar(
              FirebaseErrors.Parse(error.code),
              'Close',
              'error-snackbar'
            );
            this._loader.setLoading(false);
            reject(error.message);
          });
      }
    });
  }

  // Delete user data from firestore

  deleteUserData(uid: string): Observable<void> {
    return from(this.deleteUserDataPromise(uid)) as Observable<void>;
  }

  deleteUserDataPromise(uid: string) {
    return new Promise((resolve, reject) => {
      const userDatabase = collection(this.firestore, 'users');
      const user = collectionData(userDatabase, { idField: 'id' });

      const userRef = user.subscribe((res) => {
        const user = res.find((user) => user['uid'] === uid);
        if (user) {
          const userDoc = doc(this.firestore, 'users', user['id']);
          deleteDoc(userDoc)
            .then(() => {
              resolve('User data deleted successfully.');
            })
            .catch((error) => {
              reject(error.message);
            });
        }
      });

      if (!user) {
        reject('Failed to fetch user data. Please try again later.');
      }
    });
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }

  updatePersonalData(
    username: string,
    firstName?: string,
    lastName?: string,
    age?: number
  ): Observable<void> {
    this._loader.setLoading(true);
    const users = collection(this.firestore, 'users');

    const user = collectionData(users, { idField: 'id' });

    user.pipe(take(1)).subscribe((res) => {
      const user = res.find((user) => user['id'] === username);
      if (user) {
        const userDoc = doc(this.firestore, 'users', user['id']);
        const data = {
          firstName: firstName ? firstName : user['firstName'],
          lastName: lastName ? lastName : user['lastName'],
          age: age ? age : user['age'],
        };

        updateDoc(userDoc, data)
          .then(() => {
            this._snackbarComponent.openSnackbar(
              'Personal data updated successfully.',
              'Close',
              'success-snackbar'
            );
            this._router.navigate(['/profile']);
          })
          .catch((error) => {
            this._loader.setLoading(false);
            this._snackbarComponent.openSnackbar(
              FirebaseErrors.Parse(error.code),
              'Close',
              'error-snackbar'
            );
          });
      }
    });

    return of();
  }
}
