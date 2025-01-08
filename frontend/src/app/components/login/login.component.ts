import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { decode } from 'punycode';
import { AuthService } from '../../services/auth.service';
import { Header } from '../header/header.component';
import { UserDetails } from '../../interfaces/user-details';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  userDetails: UserDetails |null = null;
  userType: 'user' | 'admin' = 'user'; // Default to 'user'

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private Auth: AuthService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleUserType(type: 'user' | 'admin') {
    this.userType = type;
  }

  handleLogin() {
    if (this.loginForm.valid) {
      const name = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      this.Auth.login(name, password, this.userType).subscribe({
        next: (response) => {
          const token = response.token;
          if (typeof window !== 'undefined' && window.sessionStorage) {

            window.sessionStorage.setItem('token', token);
          }
          alert('login successful');
          this.fetchUserDetails();
          console.log('login successful:', response);
        },
        error: (error) => {
          alert('login failed');
          console.log('login failed:', error);
        },
        complete: () => {
          console.log('login process completed');
        },
      });
    } else alert('Please fill in both fields correctly.');
  }
  fetchUserDetails(): void {
    this.router.navigate(['/home']);
  }
}
