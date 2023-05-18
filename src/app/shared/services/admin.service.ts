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
  collectionData,
  deleteDoc,
  doc,
  documentId,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, map, of, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private _firestore: Firestore = inject(Firestore);
  private _authService: AuthService = inject(AuthService);
  private _userService: UserService = inject(UserService);
  private _shiftsService: ShiftsService = inject(ShiftsService);
  private _http: HttpClient = inject(HttpClient);
  private _loader: LoaderService = inject(LoaderService);

  authUsersReq: string = 'https://ngshift-backend.onrender.com/users';

  workers: dbUser[] = [];
  authUsers: User[] = [];

  constructor() {}

  getAuthUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.authUsersReq);
  }

  getAuthUser(uid: string): Observable<User> {
    return this._http.get<User>(this.authUsersReq + '/' + uid);
  }

  deleteAuthUser(uid: string): Observable<any> {
    return this._http.delete(this.authUsersReq + '/' + uid);
  }

  changeWorkerEmail(uid: string, email: string): Observable<any> {
    return this._http.put(this.authUsersReq + '/' + uid + '/email', {
      email: email,
    });
  }

  changeWorkerPassword(uid: string, password: string): Observable<any> {
    return this._http.put(this.authUsersReq + '/' + uid + '/password', {
      password: password,
    });
  }

  getWorkers(): Observable<dbUser[]> {
    const workers = collection(this._firestore, 'users');

    const q = query(workers, where('isAdmin', '==', false));

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

  getWorker(username: string): Observable<dbUser[]> {
    const worker = collection(this._firestore, 'users');

    const q = query(worker, where(documentId(), '==', username));

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

  deleteWorker(username: string): Observable<any> {
    const worker = collection(this._firestore, 'users');

    const q = query(worker, where(documentId(), '==', username));

    return collectionChanges(q).pipe(
      take(1),
      map((actions) => {
        actions.map((a) => {
          return deleteDoc(a.doc.ref);
        });
      })
    );
  }

  updateDbEmail(username: string, email: string): Observable<any> {
    const worker = collection(this._firestore, 'users');

    const q = query(worker, where(documentId(), '==', username));

    return collectionChanges(q).pipe(
      take(1),
      map((actions) => {
        actions.map((a) => {
          return updateDoc(a.doc.ref, { email: email });
        });
      })
    );
  }

  updatePersonalData(
    username: string,
    firstName?: string,
    lastName?: string,
    age?: number
  ): Observable<void> {
    this._loader.setLoading(true);
    const users = collection(this._firestore, 'users');

    const user = collectionData(users, { idField: 'id' });

    user.pipe(take(1)).subscribe((res) => {
      const user = res.find((user) => user['id'] === username);
      if (user) {
        const userDoc = doc(this._firestore, 'users', user['id']);
        const data = {
          firstName: firstName ? firstName : user['firstName'],
          lastName: lastName ? lastName : user['lastName'],
          age: age ? age : user['age'],
        };

        updateDoc(userDoc, data)
          .then(() => {
            this._loader.setLoading(false);
          })
          .catch((err) => {
            this._loader.setLoading(false);
            console.log(err);
          });
      }
    });

    return of();
  }
}
