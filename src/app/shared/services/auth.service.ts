import { Injectable } from '@angular/core';
import {
  Auth,
  applyActionCode,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, from, take } from 'rxjs';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { LoaderService } from './loader.service';
import { FirebaseErrors } from '../models/errors.parser';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _auth: Auth,
    private _firestore: Firestore,
    private _router: Router,
    private _snackbarComponent: SnackbarComponent,
    private _userService: UserService,
    private _snackbar: MatSnackBar,
    private _loader: LoaderService
  ) {}

  async register(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number,
    isAdmin: boolean,
    code: string
  ) {
    const userDatabase = collection(this._firestore, 'users');
    const usernameRef = doc(userDatabase, username);

    from(getDocs(userDatabase)).subscribe(async (res) => {
      const usernames = res.docs.map((doc) => doc.id);

      if (!usernames.includes(username)) {
        if (isAdmin && code.length === 6) {
          const codeDatabase = collection(getFirestore(), 'admin-codes');
          const codeRef = doc(codeDatabase, code);
          getDoc(codeRef).then((doc) => {
            if (doc.exists()) {
              const codeUsed = doc.data()['used'];
              const assignedUser = doc.data()['assignedUser'];
              if (codeUsed) {
                this._snackbarComponent.openSnackbar(
                  'Admin code already used',
                  'Error',
                  'error-snackbar'
                );
                this._loader.setLoading(false);
                return;
              } else {
                this._snackbarComponent.openSnackbar(
                  'Admin code accepted',
                  'Success',
                  'success-snackbar'
                );
                createUserWithEmailAndPassword(this._auth, email, password)
                  .then(
                    (res) => {
                      setDoc(usernameRef, {
                        email: email,
                        uid: res.user.uid,
                        firstName: firstName,
                        lastName: lastName,
                        age: age,
                        isAdmin: isAdmin,
                        adminCode: code,
                      });
                      setDoc(codeRef, { used: true, assignedUser: username });
                    },
                    (err) => {
                      this._loader.setLoading(false),
                        this._snackbarComponent.openSnackbar(
                          FirebaseErrors.Parse(err.code),
                          'Error',
                          'error-snackbar'
                        );
                    }
                  )
                  .catch((err) => {
                    this._loader.setLoading(false),
                      this._snackbarComponent.openSnackbar(
                        FirebaseErrors.Parse(err.code),
                        'Error',
                        'error-snackbar'
                      );
                  })
                  .then(() => {
                    this._snackbarComponent.openSnackbar(
                      'Admin account created',
                      'Success',
                      'success-snackbar'
                    );
                    this._router.navigate(['admin/dashboard']);
                  })
                  .catch((err) => {
                    this._loader.setLoading(false),
                      this._snackbarComponent.openSnackbar(
                        FirebaseErrors.Parse(err.code),
                        'Error',
                        'error-snackbar'
                      );
                  });
              }
            } else {
              this._loader.setLoading(false),
                this._snackbarComponent.openSnackbar(
                  'Admin code not valid',
                  'Error',
                  'error-snackbar'
                );
              return;
            }
          });
        } else {
          try {
            await createUserWithEmailAndPassword(this._auth, email, password)
              .then(
                (res) => {
                  setDoc(doc(userDatabase, username), {
                    email: email,
                    uid: res.user.uid,
                    firstName: firstName,
                    lastName: lastName,
                    age: age,
                    isAdmin: isAdmin,
                  })
                    .then(() => {
                      this._snackbarComponent.openSnackbar(
                        'Account created',
                        'Success',
                        'success-snackbar'
                      );
                      this._router.navigate(['dashboard']);
                    })
                    .catch((err) => {
                      this._loader.setLoading(false),
                        this._snackbarComponent.openSnackbar(
                          FirebaseErrors.Parse(err.code),
                          'Error',
                          'error-snackbar'
                        );
                    });
                },
                (err) => {
                  this._loader.setLoading(false),
                    this._snackbarComponent.openSnackbar(
                      FirebaseErrors.Parse(err.code),
                      'Error',
                      'error-snackbar'
                    );
                }
              )

              .catch((err) => {
                this._loader.setLoading(false),
                  this._snackbarComponent.openSnackbar(
                    FirebaseErrors.Parse(err.code),
                    'Error',
                    'error-snackbar'
                  );
              });
          } catch (err: any) {
            this._loader.setLoading(false),
              this._snackbarComponent.openSnackbar(
                FirebaseErrors.Parse(err.code),
                'Error',
                'error-snackbar'
              );
          }
        }
      }
      if (usernames.includes(username)) {
        this._loader.setLoading(false),
          this._snackbarComponent.openSnackbar(
            'Username already exists',
            'Error',
            'error-snackbar'
          );
        return;
      }
    });
  }

  login(email: string, password: string) {
    this._loader.setLoading(true);
    const validEmail = new RegExp(
      '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
    ).test(email);
    const userDatabase = collection(this._firestore, 'users');
    if (!validEmail) {
      const userRef = doc(userDatabase, email);
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          const userEmail = doc.data()['email'];
          const isAdmin = doc.data()['isAdmin'];
          signInWithEmailAndPassword(getAuth(), userEmail, password).then(
            (res) => {
              if (isAdmin) {
                this._router.navigate(['admin/dashboard']);
              } else {
                this._router.navigate(['dashboard']);
              }
              this._snackbarComponent.openSnackbar(
                'Logged in as ' + email,
                'Success',
                'success-snackbar'
              );
            },
            (err) => {
              this._loader.setLoading(false),
                this._snackbarComponent.openSnackbar(
                  FirebaseErrors.Parse(err.code),
                  'Error',
                  'error-snackbar'
                );
            }
          );
        } else {
          this._loader.setLoading(false),
            this._snackbarComponent.openSnackbar(
              'User not found',
              'Error',
              'error-snackbar'
            );
        }
      });
      return;
    }

    signInWithEmailAndPassword(getAuth(), email, password).then(
      (res) => {
        this._snackbarComponent.openSnackbar(
          'Logged in as ' + email,
          'Success',
          'success-snackbar'
        );
        collectionData(userDatabase).subscribe((res) => {
          const usersUid = res.map((doc) => doc['uid']);
          if (usersUid.includes(this._auth.currentUser?.uid)) {
            const isAdmin =
              res[usersUid.indexOf(this._auth.currentUser?.uid)]['isAdmin'];
            if (isAdmin) {
              this._router.navigate(['admin/dashboard']);
            } else {
              this._router.navigate(['dashboard']);
            }
          }
        });
      },
      (err) => {
        this._loader.setLoading(false),
          this._snackbarComponent.openSnackbar(
            FirebaseErrors.Parse(err.code),
            'Error',
            'error-snackbar'
          );
      }
    );
  }

  isLoggedIn() {
    return this.loggedInUser.asObservable();
  }

  logout() {
    return from(signOut(this._auth));
  }

  loggedInAdmin() {
    this._auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedInUser.next(true);
      } else {
        this.loggedInUser.next(false);
      }
    });
  }

  getAdminStatus() {
    const userDatabase = collection(this._firestore, 'users');

    collectionData(userDatabase).subscribe((res) => {
      const usersUid = res.map((doc) => doc['uid']);
      if (usersUid.includes(this._auth.currentUser?.uid)) {
        this.isAdmin.next(
          res[usersUid.indexOf(this._auth.currentUser?.uid)]['isAdmin']
        );
      } else {
        return this.isAdmin.next(false);
      }
    });

    return this.isAdmin.asObservable();
  }

  sendVerificationEmail() {
    this._loader.setLoading(true);
    sendEmailVerification(this._auth.currentUser!)
      .then(
        () =>
          this._snackbarComponent.openSnackbar(
            'Email sent',
            'Success',
            'success-snackbar'
          ),
        (err) => {
          this._loader.setLoading(false),
            this._snackbarComponent.openSnackbar(
              FirebaseErrors.Parse(err.code),
              'error',
              'error-snackbar'
            );
        }
      )
      .then(() => {
        this._router.navigate(['profile']).then(() => {
          window.location.reload();
        });
      })

      .catch((err) => {
        this._loader.setLoading(false),
          this._snackbarComponent.openSnackbar(
            FirebaseErrors.Parse(err.code),
            'error',
            'error-snackbar'
          );
      });
  }

  confirmEmailCode(code: string) {
    applyActionCode(this._auth, code)
      .then(
        () =>
          this._snackbarComponent.openSnackbar(
            'Email verified',
            'Success',
            'success-snackbar'
          ),
        (err) => {
          this._loader.setLoading(false),
            this._snackbarComponent.openSnackbar(
              FirebaseErrors.Parse(err.code),
              'error',
              'error-snackbar'
            );
        }
      )
      .then(() => {
        this._userService.getCurrentUser().then(() => {
          this.isLoggedIn().subscribe((res) => {
            if (res) {
              this._router.navigate(['profile']).then(() => {
                window.location.reload();
              });
            } else {
              this._router.navigate(['login']);
            }
          });
        });
      })
      .catch((err) => {
        this._loader.setLoading(false),
          this._snackbarComponent.openSnackbar(
            FirebaseErrors.Parse(err.code),
            'error',
            'error-snackbar'
          );
      });
  }

  updateEmail(username: string, newEmail: string) {
    this._loader.setLoading(true);
    updateEmail(this._auth.currentUser!, newEmail)
      .then(
        () => {
          this._snackbarComponent.openSnackbar(
            'Email updated',
            'Success',
            'success-snackbar'
          );
          const userDatabase = collection(this._firestore, 'users');
          const userRef = doc(userDatabase, username);
          updateDoc(userRef, {
            email: newEmail,
          }).then(() => {
            this._router.navigate(['profile']).then(() => {
              window.location.reload();
            });
          });
        },
        (err) => {
          this._loader.setLoading(false),
            this._snackbarComponent.openSnackbar(
              FirebaseErrors.Parse(err.code),
              'Close',
              'error-snackbar'
            );
        }
      )
      .then(() => {
        this._userService.getCurrentUser().then(() => {
          this.isLoggedIn().subscribe((res) => {
            if (!res) {
              this._router.navigate(['login']);
            }
          });
        });
      })
      .catch((err) => {
        this._loader.setLoading(false),
          this._snackbarComponent.openSnackbar(
            FirebaseErrors.Parse(err.code),
            'error',
            'error-snackbar'
          );
      });
  }
}
