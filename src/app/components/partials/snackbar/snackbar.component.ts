import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
})
export class SnackbarComponent implements OnInit {
  private _snackbar: MatSnackBar = inject(MatSnackBar);

  opened!: boolean;

  error!: string;

  ngOnInit(): void {}

  openSnackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [className],
    });
  }

  closeSnackbar() {
    this._snackbar.dismiss();
  }
}
