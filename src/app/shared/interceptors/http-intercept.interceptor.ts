import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';

@Injectable()
export class HttpInterceptInterceptor implements HttpInterceptor {
  constructor(private _snackbarComponent: SnackbarComponent) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        (event) => {
          console.log(event);

          if (event instanceof HttpResponse) {
            console.log(event.body);
            this._snackbarComponent.openSnackbar(
              event.statusText,
              'success',
              'success-snackbar'
            );
          }
        },
        (error) => {
          console.log(error);
          this._snackbarComponent.openSnackbar(
            error.statusText,
            'error',
            'error-snackbar'
          );
        }
      )
    );
  }
}
