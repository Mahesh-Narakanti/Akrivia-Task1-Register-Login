import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError ,tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private token :string|null=null;
   private flag :any;
  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string, addresses:any[] , languages: any[] ): Observable<any> {
    const details = { username, email, password, addresses, languages };
    this.flag=false;
    return this.http.post('http://localhost:3000/register', details, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)  
    );
  }
  
  login(username: string, password: string): Observable<any> {
    const body = { username, password }; 
    return this.http.post('http://localhost:3000/login', body, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }


  getUserDetails(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      throw new Error('No token found');
    }
    this.flag=true;
    return this.http.get<any>('http://localhost:3000/user-details', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });  }

    isAuthentic():boolean{
      return this.flag;
    }

  private handleError(error: any): Observable<never> {
    console.log('Error occurred', error);
    return throwError('An error occurred while processing your request.');
  }
}

