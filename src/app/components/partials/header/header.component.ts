import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
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

  logout() {
    this.auth.logout();
    console.log('Logout');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
