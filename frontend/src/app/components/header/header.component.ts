import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
})
export class Header {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
  }

  logout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
