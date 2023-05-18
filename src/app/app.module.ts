import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/partials/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/partials/auth-action/verify-email/verify-email.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { ShiftsComponent } from './components/user/shifts/shifts.component';
import { AddShiftComponent } from './components/user/shifts/add-shift/add-shift.component';
import { EditShiftComponent } from './components/user/shifts/edit-shift/edit-shift.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { WorkersComponent } from './components/admin/workers/workers.component';
import { WorkerProfileComponent } from './components/admin/workers/worker-profile/worker-profile.component';
import { WorkerShiftsComponent } from './components/admin/workers/worker-shifts/worker-shifts.component';
import { AllShiftsComponent } from './components/user/shifts/all-shifts/all-shifts.component';
import { UpcomingShiftComponent } from './components/user/dashboard/upcoming-shift/upcoming-shift.component';
import { PastShiftsComponent } from './components/user/dashboard/past-shifts/past-shifts.component';
import { ChartComponent } from './components/user/dashboard/chart/chart.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminShiftsComponent } from './components/admin/admin-shifts/admin-shifts.component';
import { ShiftsChartComponent } from './components/admin/admin-dashboard/shifts-chart/shifts-chart.component';
import { WorkersPastShiftsComponent } from './components/admin/admin-dashboard/workers-past-shifts/workers-past-shifts.component';
import { AdminEditShiftComponent } from './components/admin/admin-shifts/admin-edit-shift/admin-edit-shift.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { ShowPasswordComponent } from './components/partials/show-password/show-password.component';
import { EditProfileComponent } from './components/user/profile/edit-profile/edit-profile.component';
import { SnackbarComponent } from './components/partials/snackbar/snackbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DateValidatorDirective } from './shared/validators/date-validator.directive';
import { HttpInterceptInterceptor } from './shared/interceptors/http-intercept.interceptor';
import { UniqueNameDirective } from './shared/validators/unique-name.directive';
import { activateGuard } from './shared/guards/activate.guard';
import { canDeactivate } from './shared/guards/deactivate.guard';
import { DialogComponent } from './components/partials/dialog/dialog.component';
import { SpinnerComponent } from './components/partials/spinner/spinner.component';
import { ResetPasswordComponent } from './components/partials/auth-action/reset-password/reset-password.component';
import { AuthActionComponent } from './components/partials/auth-action/auth-action.component';
import { isAdminGuard } from './shared/guards/admin.guard';
import { isUserGuard } from './shared/guards/user.guard';
import { EditWorkerComponent } from './components/admin/workers/worker-profile/edit-worker/edit-worker.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    canDeactivate: [canDeactivate],
    component: RegisterComponent,
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'verify-email',
    canActivate: [activateGuard],
    component: VerifyEmailComponent,
  },
  {
    path: 'auth/action',
    component: AuthActionComponent,
  },
  {
    path: 'dashboard',
    canActivate: [activateGuard, isUserGuard],
    component: DashboardComponent,
  },
  {
    path: 'shifts',
    canActivate: [activateGuard, isUserGuard],
    component: ShiftsComponent,
  },
  {
    path: 'add-shift',
    canActivate: [activateGuard, isUserGuard],
    canDeactivate: [canDeactivate],
    component: AddShiftComponent,
    pathMatch: 'full',
  },
  {
    path: 'edit/:id',
    canActivate: [activateGuard, isUserGuard],
    canDeactivate: [canDeactivate],
    component: EditShiftComponent,
  },
  {
    path: 'profile',
    canActivate: [activateGuard, isUserGuard],
    component: ProfileComponent,
  },
  {
    path: 'profile/edit/:property',
    canActivate: [activateGuard, isUserGuard],
    canDeactivate: [canDeactivate],
    component: EditProfileComponent,
  },
  {
    path: 'admin/dashboard',
    canActivate: [activateGuard, isAdminGuard],
    component: AdminDashboardComponent,
  },
  {
    path: 'admin/workers',
    canActivate: [activateGuard, isAdminGuard],
    component: WorkersComponent,
  },
  {
    path: 'admin/shifts',
    canActivate: [activateGuard, isAdminGuard],
    component: AdminShiftsComponent,
  },
  {
    path: 'admin/shifts/edit/:id',
    canActivate: [activateGuard, isAdminGuard],
    canDeactivate: [canDeactivate],
    component: AdminEditShiftComponent,
  },
  {
    path: 'admin/workers/:id',
    canActivate: [activateGuard, isAdminGuard],
    component: WorkerProfileComponent,
  },
  {
    path: 'admin/workers/:id/edit/:property',
    canActivate: [activateGuard, isAdminGuard],
    canDeactivate: [canDeactivate],
    component: EditWorkerComponent,
  },
  {
    path: 'admin/workers/:id/shifts',
    canActivate: [activateGuard, isAdminGuard],
    component: WorkerShiftsComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DashboardComponent,
    ShiftsComponent,
    AddShiftComponent,
    EditShiftComponent,
    ProfileComponent,
    WorkersComponent,
    WorkerProfileComponent,
    WorkerShiftsComponent,
    AllShiftsComponent,
    UpcomingShiftComponent,
    PastShiftsComponent,
    ChartComponent,
    AdminDashboardComponent,
    AdminShiftsComponent,
    ShiftsChartComponent,
    WorkersPastShiftsComponent,
    AdminEditShiftComponent,
    NotFoundComponent,
    FooterComponent,
    ShowPasswordComponent,
    EditProfileComponent,
    SnackbarComponent,
    DateValidatorDirective,
    UniqueNameDirective,
    DialogComponent,
    SpinnerComponent,
    ResetPasswordComponent,
    AuthActionComponent,
    EditWorkerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDialogModule,
  ],
  providers: [
    SnackbarComponent,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000 },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [SpinnerComponent], // for dialog component
})
export class AppModule {}
