import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  errorMessages: string[] = [];
  validationMessages: string[] = [];

  constructor(private auth: Auth) {}

  register(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number,
    isAdmin: boolean,
    code: string
  ) {
    const userRef = doc(getFirestore(), 'users', username);
    if (!userRef) {
      if (isAdmin && code.length === 6) {
        console.log(code);
        const codeDatabase = collection(getFirestore(), 'admin-codes');
        const codeRef = doc(codeDatabase, code);
        getDoc(codeRef).then((doc) => {
          if (doc.exists()) {
            const codeUsed = doc.data()['used'];
            if (codeUsed) {
              this.errorMessages.push('Code already used');
              return;
            } else {
              this.validationMessages.push('Code is valid');
              setDoc(codeRef, { used: true });
              createUserWithEmailAndPassword(this.auth, email, password)
                .then(
                  (res) => {
                    setDoc(userRef, {
                      email: email,
                      uid: res.user.uid,
                      firstName: firstName,
                      lastName: lastName,
                      age: age,
                      isAdmin: isAdmin,
                    });
                  },
                  (err) => this.errorMessages.push(err)
                )
                .catch((err) => this.errorMessages.push(err))
                .then(() => {
                  this.validationMessages.push('Admin account created');
                });
            }
          } else {
            this.errorMessages.push('Code does not exist');
            return;
          }
        });
      } else {
        createUserWithEmailAndPassword(this.auth, email, password)
          .then(
            (res) => {
              setDoc(userRef, {
                email: email,
                uid: res.user.uid,
                firstName: firstName,
                lastName: lastName,
                age: age,
                isAdmin: isAdmin,
              });
            },
            (err) => this.errorMessages.push(err)
          )
          .catch((err) => this.errorMessages.push(err));
      }
    } else {
      this.errorMessages.push('Username already exists');
      return;
    }
  }

  login(email: string, password: string): void {
    const validEmail = new RegExp(
      '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
    ).test(email);
    if (!validEmail) {
      const userDatabase = collection(getFirestore(), 'users');
      const userRef = doc(userDatabase, email);
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          console.log('Document data:', doc.data());
          const userEmail = doc.data()['email'];
          signInWithEmailAndPassword(getAuth(), userEmail, password).then(
            (res) => console.log(res, ' logged in by username'),
            (err) => console.log(err)
          );
        } else {
          console.log('No such document!');
        }
      });

      return;
    }
    signInWithEmailAndPassword(getAuth(), email, password).then(
      (res) => console.log(res, ' logged in by email'),
      (err) => console.log(err)
    );
  }

  logout() {
    signOut(this.auth);
  }

  getErrorMessages(): Observable<string[]> {
    return new Observable((observer) => {
      observer.next(this.errorMessages);
    });
  }

  getValidationMessages() {
    return this.validationMessages;
  }

  clearMessages() {
    this.errorMessages = [];
    this.validationMessages = [];
  }
}
