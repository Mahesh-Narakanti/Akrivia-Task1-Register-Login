import { NgIf } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, DoCheck } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements DoCheck {
  title = 'task1';
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}
  ngDoCheck(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = window.sessionStorage.getItem('token');
      if (token) this.isLoggedIn = true;
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem('token');
    }
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
