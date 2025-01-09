import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { AllUsers } from '../interfaces/user';

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
    const details = {
      name,
      email,
      password,
      addresses,
      languages,
      type,
      profilePicture,
    };
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
    return this.http.get<any>(`${this.apiURL}/users/user-details`);
  }

  getALLUsers(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/users/allUsers`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  getAllData(): Observable<any>{
    return this.http.get<AllUsers>(`${this.apiURL}/users/allData`);
  }
  updateUser(
    id: string,
    name: string,
    email: string,
    password: string,
    profilePicture: string | null
  ): Observable<any> {
    const details = { id, name, email, password, profilePicture };
    return this.http
      .put(`${this.apiURL}/users/update-user`, details)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiURL}/users/delete-user`, { body: { id } })
      .pipe(catchError(this.handleError));
  }

  isAuthentic(): Observable<boolean> {
    let token = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      token = window.sessionStorage.getItem('token');
    }

    if (token) {
      return this.http.get(`${this.apiURL}/api/protected-data`).pipe(
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
