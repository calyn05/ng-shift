import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-action',
  templateUrl: './auth-action.component.html',
  styleUrls: ['./auth-action.component.css'],
})
export class AuthActionComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  mode!: string;

  ngOnInit(): void {
    this.mode = this._route.snapshot.queryParams['mode'];
  }
}
