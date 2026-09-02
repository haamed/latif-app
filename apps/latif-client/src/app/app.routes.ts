import { Route } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { PersonListComponent } from './person/person-list/person-list.component';
import { PersonFormComponent } from './person/person-form/person-form.component';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './auth/auth.guard';
import { AuthCallbackComponent } from './auth/auth-callback.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: 'users/new', component: UserFormComponent, canActivate: [authGuard] },
  {
    path: 'users/:id/edit',
    component: UserFormComponent,
    canActivate: [authGuard],
  },
  { path: 'people', component: PersonListComponent, canActivate: [authGuard] },
  {
    path: 'people/new',
    component: PersonFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'people/:id/edit',
    component: PersonFormComponent,
    canActivate: [authGuard],
  },
];
