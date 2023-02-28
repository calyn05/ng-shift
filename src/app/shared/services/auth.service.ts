import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  register(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number,
    isAdmin: boolean
  ) {
    createUserWithEmailAndPassword(this.auth, email, password).then(
      (res) => {
        console.log(res);
        const userRef = doc(getFirestore(), 'users', res.user.uid);
        setDoc(userRef, {
          username: username,
          uid: res.user.uid,
          firstName: firstName,
          lastName: lastName,
          age: age,
          isAdmin: isAdmin,
        });
      },
      (err) => console.log(err)
    );
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(getAuth(), email, password).then(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  logout() {
    signOut(this.auth);
  }
}
