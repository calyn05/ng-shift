import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authLink = {
    login: { path: '/login', name: 'Login' },
    register: { path: '/register', name: 'Register' },
    forgotPassword: { path: '/forgot-password', name: 'Forgot Password' },
  };

  events: NavigationEvent[] = [];

  url!: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe((event: NavigationEvent) => {
      this.events.push(event);
      if (event instanceof NavigationStart) {
        this.url = event.url;
      }
    });
  }

  ngOnInit(): void {
    console.log('Header component initialized');
  }

  ngOnDestroy(): void {
    console.log('Header component destroyed');
  }
}
