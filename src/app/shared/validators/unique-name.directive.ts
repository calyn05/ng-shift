import { Directive } from '@angular/core';
import { ShiftsService } from '../services/shifts.service';
import {
  AbstractControl,
  AsyncValidatorFn,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable, debounceTime, map, of, take } from 'rxjs';
import { Shift } from '../models/shift';
import { user } from '@angular/fire/auth';

@Directive({
  selector: '[appUniqueName]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqueNameDirective,
      multi: true,
    },
  ],
})
export class UniqueNameDirective {
  constructor() {}

  static uniqueName(
    shiftsService: ShiftsService,
    userService: UserService
  ): AsyncValidatorFn {
    let username: string;
    userService.getCurrentUser().then(() => {
      userService.getUserData().subscribe((user) => {
        username = user.username;
      });
    });
    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      return shiftsService.checkUniqueName(control.value, username).pipe(
        debounceTime(1000),
        take(1),
        map((shifts: Shift[]) => {
          return shifts && shifts.length > 0 ? { uniqueName: true } : null;
        })
      );
    };
  }
}
