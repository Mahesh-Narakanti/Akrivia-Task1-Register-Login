import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { Header } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Header
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Signup page',
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'login',
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'home', component:HomeComponent ,canActivate:[AuthGuard]},
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }


];