import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Shift } from '../models/shift';
import {
  Firestore,
  collection,
  CollectionReference,
  collectionChanges,
  addDoc,
  doc,
  collectionData,
  Query,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  updateDoc,
  DocumentReference,
  DocumentData,
  getDocs,
  writeBatch,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import {
  Observable,
  Subscription,
  from,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class ShiftsService {
  private _authService: AuthService = inject(AuthService);
  private _firestore: Firestore = inject(Firestore);
  private _userService: UserService = inject(UserService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _loader: LoaderService = inject(LoaderService);

  private _shiftsCollection: CollectionReference = collection(
    this._firestore,
    'shifts'
  );

  shiftToEdit!: Shift;

  constructor() {}

  async addShift(shift: Shift): Promise<void> {
    this._userService.getUserData().subscribe((user) => {
      const username = user.username;
      const shiftToAdd = {
        ...shift,
        username,
      };
      this._loader.setLoading(false);
      addDoc(this._shiftsCollection, shiftToAdd);
    });
  }

  getShifts(): Observable<Shift[]> {
    const shifts = collection(this._firestore, 'shifts');
    const q = query(shifts, orderBy('startDate', 'desc'));

    return collectionChanges(q).pipe(
      map((res) => {
        return res.map((shift) => {
          const shiftData = shift.doc.data() as Shift;
          return shiftData;
        });
      })
    );
  }

  getShiftsByUsername(username: string): Observable<Shift[]> {
    const shifts = collection(this._firestore, 'shifts');
    const q = query(
      shifts,
      where('username', '==', username),
      orderBy('startDate', 'desc')
    );

    return collectionChanges(q).pipe(
      map((res) => {
        return res.map((shift) => {
          const shiftData = shift.doc.data() as Shift;
          return shiftData;
        });
      })
    );
  }

  checkUniqueName(name: string, username: string): Observable<Shift[]> {
    const shifts = collection(this._firestore, 'shifts');

    const q = query(shifts, where('username', '==', username));

    const shifts$ = collectionData(q).pipe(
      map((res) => {
        if (res.length === 0) {
          return [] as Shift[];
        }
        return res.map((shift) => {
          return shift as Shift;
        });
      })
    );

    return shifts$.pipe(
      map((res) => {
        return res.filter((shift) => shift.uniqueName === name) as Shift[];
      })
    );
  }

  setShiftToEdit(shift: Shift) {
    this.shiftToEdit = shift;
  }

  getShiftToEdit(): Observable<Shift> {
    return of(this.shiftToEdit);
  }

  getNextShift(username: string): Observable<Shift> {
    const shifts = collection(this._firestore, 'shifts');
    const today = new Date();

    const q = query(
      shifts,
      where('username', '==', username),
      orderBy('startDate', 'asc')
    );

    return collectionChanges(q).pipe(
      map((res) => {
        const nextShift = res.find((shift) => {
          const shiftDate = new Date(shift.doc.data()['startDate']);
          return shiftDate >= today;
        });
        return nextShift;
      }),
      map((res) => {
        const shift = res?.doc.data() as Shift;
        return shift as Shift;
      })
    );
  }

  getPastWeekShifts(username: string): Observable<Shift[]> {
    const shifts = collection(this._firestore, 'shifts');
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    let q = query(
      shifts,
      where('username', '==', username),
      orderBy('startDate', 'desc')
    );

    return collectionChanges(q).pipe(
      map((res) => {
        const shifts = res.map((shift) => {
          const shiftData = shift.doc.data() as Shift;
          const shiftDate = new Date(shiftData.startDate);

          const isPastWeek = shiftDate >= lastWeek && shiftDate <= today;
          return isPastWeek ? shiftData : null;
        });
        return shifts.filter((shift) => shift !== null) as Shift[];
      })
    );
  }

  getEarningsPerMonth(
    username: string
  ): Observable<{ month: string; earnings: number }[]> {
    const shifts = collection(this._firestore, 'shifts');
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    let q = query(
      shifts,
      where('username', '==', username),
      orderBy('startDate', 'asc')
    );

    return collectionChanges(q).pipe(
      take(1),
      map((res) => {
        const shifts = res.map((shift) => {
          const shiftData = shift.doc.data() as Shift;
          const shiftDate = new Date(shiftData.startDate);

          const isPastYear = shiftDate >= lastYear && shiftDate <= today;

          if (isPastYear) {
            const newShifts = new Array(
              new Shift(
                shiftData.uniqueName,
                shiftData.startDate,
                shiftData.startTime,
                shiftData.endDate,
                shiftData.endTime,
                shiftData.wage,
                shiftData.location,
                shiftData.description,
                shiftData.username
              )
            );
            return newShifts;
          }
          return null;
        });
        return shifts.filter((shift) => shift !== null);
      }),
      map((shifts) => {
        if (shifts.length === 0) {
          return [];
        }
        return this.calculateEarningsPerMonth(shifts.flat() as Shift[]);
      })
    );
  }

  calculateEarningsPerMonth(
    shifts: Shift[]
  ): { month: string; earnings: number }[] {
    if (shifts.length === 1) {
      const shiftDate = new Date(shifts[0].startDate);
      const month = shiftDate.toLocaleString('default', { month: 'long' });
      const earnings = shifts[0].totalShiftWage();
      return [{ month, earnings }];
    } else {
      const earningsPerMonth = shifts.reduce((acc, shift) => {
        const shiftDate = new Date(shift.startDate);
        const month = shiftDate.toLocaleString('default', { month: 'long' });
        const earnings = shift.totalShiftWage();
        if (acc[month]) {
          acc[month] += earnings;
        } else {
          acc[month] = earnings;
        }
        return acc;
      }, {} as { [key: string]: number });

      return Object.entries(earningsPerMonth).map(([month, earnings]) => {
        return { month, earnings };
      });
    }
  }

  updateShift(shift: Shift, updatedShift: Shift): Observable<unknown> {
    const shifts = collection(this._firestore, 'shifts');
    const q = query(shifts, where('username', '==', shift.username));

    return collectionChanges(q).pipe(
      take(1),
      map((res) => {
        const shiftToUpdate = res.find((s) => {
          const shiftData = s.doc.data() as Shift;
          return shiftData.uniqueName === shift.uniqueName;
        });
        return shiftToUpdate;
      }),
      map((res) => {
        const shiftId = res?.doc.id;
        return shiftId;
      }),
      switchMap((res) => {
        return updateDoc(doc(this._firestore, 'shifts', res as string), {
          uniqueName: updatedShift.uniqueName,
          startDate: updatedShift.startDate,
          startTime: updatedShift.startTime,
          endDate: updatedShift.endDate,
          endTime: updatedShift.endTime,
          wage: updatedShift.wage,
          location: updatedShift.location,
          description: updatedShift.description,
          username: updatedShift.username,
        });
      })
    );
  }

  deleteShift(shift: Shift): Observable<unknown> {
    this._loader.setLoading(true);
    const shifts = collection(this._firestore, 'shifts');
    const q = query(shifts, where('username', '==', shift.username));

    return collectionChanges(q).pipe(
      take(1),
      map((res) => {
        const shiftToDelete = res.find((s) => {
          const shiftData = s.doc.data() as Shift;
          return shiftData.uniqueName === shift.uniqueName;
        });
        return shiftToDelete;
      }),
      map((res) => {
        const shiftId = res?.doc.id;
        return shiftId;
      }),
      switchMap((res) => {
        return deleteDoc(doc(this._firestore, 'shifts', res as string));
      })
    );
  }

  deleteAllShifts(username: string): Observable<unknown> {
    const shifts = collection(this._firestore, 'shifts');
    const q = query(shifts, where('username', '==', username));

    return collectionChanges(q).pipe(
      take(1),
      map((res) => {
        const shiftsToDelete = res.map((s) => {
          const shiftData = s.doc.data() as Shift;
          return shiftData;
        });
        return shiftsToDelete;
      }),
      map((res) => {
        const shiftsNames = res.map((shift) => shift.uniqueName);
        return shiftsNames;
      }),
      map((res) => {
        const shiftsIds = res.map((name) => {
          const q = query(
            collection(this._firestore, 'shifts'),
            where('uniqueName', '==', name)
          );
          return collectionChanges(q).pipe(
            take(1),
            map((res) => {
              const shift = res[0];
              return shift.doc.id;
            })
          );
        });
        shiftsIds.forEach(
          (id) => {
            id.subscribe((res) => {
              const batch = writeBatch(this._firestore);
              batch.delete(doc(this._firestore, 'shifts', res as string));
              batch.commit();
            });
          },
          (err: any) => {
            this._snackbarComponent.openSnackbar(
              err.message,
              'Close',
              'error-snackbar'
            );
          }
        );
      })
    );
  }
}
