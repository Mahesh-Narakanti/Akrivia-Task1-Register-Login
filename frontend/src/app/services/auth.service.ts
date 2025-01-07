import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  flag: boolean = false;
  private apiURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  register(
    name: string,
    email: string,
    password: string,
    addresses: any[],
    languages: any[],
    type: string,
    profilePicture: string | null
  ): Observable<any> {
    const details = { name, email, password, addresses, languages, type, profilePicture };
    console.log(' hello');
    return this.http
      .post(`${this.apiURL}/auth/register`, details)
      .pipe(catchError(this.handleError));
  }

  login(name: string, password: string, type: string): Observable<any> {
    const body = { name, password, type };
    return this.http
      .post(`${this.apiURL}/auth/login`, body)
      .pipe(catchError(this.handleError));
  }

  getUserDetails(): Observable<any> {
    const token = sessionStorage.getItem('token');
    console.log(token);
    if (!token) {
      throw new Error('No token found');
    }
    this.flag = true;
    return this.http.get<any>(`${this.apiURL}/users/user-details`);
  }

  getALLUsers(): Observable<any> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return this.http.get<any>(`${this.apiURL}/users/allUsers`);
  }

  updateUser(
    id: string,
    name: string,
    email: string,
    password: string,
    profilePicture: string | null
  ): Observable<any> {
    const details = { id, name, email, password ,profilePicture};
    return this.http
      .put(`${this.apiURL}/users/update-user`, details, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(catchError(this.handleError));
  }


  isAuthentic(): Observable<boolean> {
    const token = sessionStorage.getItem('token');

    if (token) {
      return this.http
        .get(`${this.apiURL}/api/protected-data`)
        .pipe(
          map((response) => {
            console.log('Authenticated: ', response);
            return true;
          }),
          catchError((error) => {
            console.error('Token expired or invalid', error);
            return of(false);
          })
        );
    } else {
      return of(false);
    }
  }




  private handleError(error: any): Observable<never> {
    console.log('Error occurred', error);
    return throwError(
      () => new Error('An error occurred while processing your request.')
    );
  }
}
