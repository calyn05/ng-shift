import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-password',
  templateUrl: './show-password.component.html',
  styleUrls: ['./show-password.component.css'],
})
export class ShowPasswordComponent implements OnInit {
  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {}
  showPassword() {
    const passwordInput =
      this.elRef.nativeElement.parentElement.querySelector('input');
    if (passwordInput.type === 'text') passwordInput.type = 'password';
    else passwordInput.type = 'text';
  }
}
