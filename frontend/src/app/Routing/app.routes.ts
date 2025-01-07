import { Routes } from '@angular/router';
import { Header } from '../components/header/header.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { Page1Component } from '../components/page1/page1.component';

import { AuthGuard } from './auth.guard';
import { Page2Component } from '../components/page2/page2.component';
import { RegisterComponent } from '../components/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: Header,
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadComponent() {
      return import('../components/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'page1',
    loadComponent() {
      return import('../components/page1/page1.component').then(
        (m) => m.Page1Component
      );
    },
    canActivate: [AuthGuard],
    data: {
      roles: ['admin'],
    },
  },
  {
    path: 'page2',
    loadComponent() {
      return import('../components/page2/page2.component').then(
        (m) => m.Page2Component
      );
    },
    canActivate: [AuthGuard],
    data: {
      roles: ['admin'],
    },
  },
  {
    path: 'register',
    loadComponent() {
      return import('../components/register/register.component').then(
        (m) => m.RegisterComponent
      );
    },
    title: 'Signup page',
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent() {
      return import('../components/login/login.component').then(
        (m) => m.LoginComponent
      );
    },
    title: 'login',
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
