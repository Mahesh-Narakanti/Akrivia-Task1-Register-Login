import { NgIf } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, DoCheck } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule,NgIf, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements DoCheck{
  title = 'task1';
  isLoggedIn: boolean = false;
  
    constructor(private router: Router) {}
  ngDoCheck(): void {
    this.checkLoginStatus();
  }

    checkLoginStatus(): void {
      const token = sessionStorage.getItem('token');
      if(token)
      this.isLoggedIn = true;
    }
  
    logout(): void {
      sessionStorage.removeItem('token');
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }
}
