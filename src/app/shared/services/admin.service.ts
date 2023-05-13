import { Injectable, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { ShiftsService } from './shifts.service';
import { dbUser } from '../models/dbUser.model';
import {
  Firestore,
  collection,
  collectionChanges,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private _firestore: Firestore = inject(Firestore);
  private _authService: AuthService = inject(AuthService);
  private _userService: UserService = inject(UserService);
  private _shiftsService: ShiftsService = inject(ShiftsService);

  authUsersReq: string = 'https://ngshift-backend.onrender.com/users';

  workers: dbUser[] = [];
  authUsers: User[] = [];

  constructor() {}

  async getAuthUsers(): Promise<User[]> {
    const res = await fetch(this.authUsersReq);
    const users = await res.json();
    return users;
  }

  getWorkers(): Observable<dbUser[]> {
    const workers = collection(this._firestore, 'users');

    const q = query(workers, where('isAdmin', '==', false));

    console.log(workers);

    return collectionChanges(q).pipe(
      take(1),
      map((actions) =>
        actions.map((a) => {
          const data = a.doc.data() as dbUser;
          const id = a.doc.id;
          return { id, ...data };
        })
      )
    );
  }
}
