import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'C:/Users/akrivia/UserWeb/frontend/src/app/auth.service';
import { HttpParams ,HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { HomeComponent } from '../home/home.component';


@Component({
  selector: 'app-login',
  standalone:true,
  imports: [RouterLink , ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  userDetails: any = null;

  constructor(private fb: FormBuilder, private router: Router ,private Auth:AuthService) {
      this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): Observable<any> {
    if (this.loginForm.valid) {
      const username=this.loginForm.get('username')?.value;
      const password=this.loginForm.get('password')?.value;
      return this.Auth.login(username,password);
    } else {
      alert('Please fill in both fields correctly.');
    }
    return new Observable();
  }
  handleLogin(){
    this.onLogin().subscribe({
     next: (response)=>{
      alert("login successful");
      localStorage.setItem('token', response.token);
      this.fetchUserDetails();
        console.log('login successful:',response);
      },
      error: (error)=>{
        alert("login failed");
        console.log('login failed:',error);
      },
      complete: ()=>{
        console.log('login process completed');
      }
    }
    );
  }
  fetchUserDetails():void{
   this.Auth.getUserDetails().subscribe(
    { next:(data)=>{
      console.log(data);
      this.userDetails=data;
    },
     error:(error) => {
      console.error('Error fetching user details:', error);
    },
    complete:()=>{
      console.log("here you go");
    }
  }
   );
   this.router.navigate(['/home']);
  }
}
