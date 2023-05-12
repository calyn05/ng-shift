import { Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private auth: Auth = inject(Auth);
  private _loader: LoaderService = inject(LoaderService);
  private _zone: NgZone = inject(NgZone);

  userMenu: { path: string; name: string }[] = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/shifts', name: 'My Shifts' },
    { path: '/profile', name: 'Profile' },
  ];

  adminMenu: { path: string; name: string }[] = [
    { path: '/admin/dashboard', name: 'Dashboard' },
    { path: '/admin/shifts', name: 'Shifts' },
    { path: '/admin/workers', name: 'Workers' },
  ];

  shiftsMenuTab!: { path: string; name: string };
  profileMenuTab!: { path: string; name: string };
  dashboardMenuTab!: { path: string; name: string };

  authLink = {
    login: { path: '/login', name: 'Login' },
    register: { path: '/register', name: 'Register' },
    forgotPassword: { path: '/forgot-password', name: 'Forgot Password' },
  };

  events: NavigationEvent[] = [];

  url!: string;

  logoUrl!: string;

  username!: string;

  constructor(private _snackbarComponent: SnackbarComponent) {}

  ngOnInit(): void {
    this.authService.loggedInAdmin();

    this.authService.getAdminStatus().subscribe((res) => {
      if (
        res &&
        (this.router.url.includes('login') ||
          this.router.url.includes('register'))
      ) {
        this.router.navigate(['/admin/dashboard']);
      }
    });

    this.authService.isLoggedIn().subscribe((res) => {
      if (
        res &&
        (this.router.url.includes('login') ||
          this.router.url.includes('register'))
      ) {
        this._zone.run(() => {
          this.router.navigate(['/dashboard']);
        }),
          (err: any) => {
            this._snackbarComponent.openSnackbar(
              err.message,
              'error',
              'error-snakbar'
            );
          };
      }
    });

    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userService.getUserData().subscribe((res) => {
          this.username = res.username;
        });
      }
    });

    this.router.events.subscribe((event: NavigationEvent) => {
      this.events.push(event);
      if (event instanceof NavigationStart) {
        this.url = event.url;
        if (this.url.includes('admin')) {
          this.dashboardMenuTab = this.adminMenu[0];
          this.shiftsMenuTab = this.adminMenu[1];
          this.profileMenuTab = this.adminMenu[2];
          this.logoUrl = this.adminMenu[0].path;
        } else {
          this.dashboardMenuTab = this.userMenu[0];
          this.shiftsMenuTab = this.userMenu[1];
          this.profileMenuTab = this.userMenu[2];
          this.logoUrl = this.userMenu[0].path;
        }
      }
    });
  }

  ngOnDestroy(): void {}

  logout() {
    this._loader.setLoading(true);
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        this._snackbarComponent.openSnackbar(
          err.message,
          'error',
          'error-snackbar'
        );
      },
    });
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
