import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthentic().pipe(
      map((isAuthenticated) => {
        const path = next.routeConfig?.path;
        const reqRole = next.data?.['roles'];
        const curRole = next.queryParams?.['role'];
        const currentNavigation = this.router.getCurrentNavigation();
        const isEditMode = currentNavigation?.extras?.state?.['isEditMode'];
        console.log(isEditMode);
        if (path === 'home' && !isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }
 
        if (path === 'register' && isAuthenticated && isEditMode) {
          return true;
        }

        if (
          (path === 'login' || path === 'register' || path === '') &&
          isAuthenticated
        ) {
          this.router.navigate(['/home']);
          return false;
        }

        if ((path === 'login' || path === 'register') && !isAuthenticated) {
          return true;
        }

        if (path === 'home' && isAuthenticated) {
          return true;
        }

        if ((path === 'page1' || path === 'page2') && isAuthenticated && reqRole.includes(curRole) ) {
          return true;
        }

        if (path === '' && !isAuthenticated) return true;
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
