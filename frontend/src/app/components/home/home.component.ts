import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Header } from '../header/header.component';
import { map } from 'rxjs';
import { UserDetails } from '../../interfaces/user-details';
import { AllUsers } from '../../interfaces/user';
import * as XLSX from 'xlsx';
import { response } from 'express';



@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userDetails: UserDetails | null = null;
  allUsers: AllUsers[] = [];
  tokenExpired: boolean = false;

  constructor(
    private Auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
  //  this.Auth.makeRequest();
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.Auth.isAuthentic().subscribe({
        next: (isAuthenticated) => {
          if (isAuthenticated) {
            this.fetchUserDetails();
            this.fetchAllUsers();
          } else {
            console.error('User is not authenticated');
          }
        },
        error: (error) => {
          console.error('Error checking authentication:', error);
        },
      });
    } else {
      this.tokenExpired = true;
    }
  }

  fetchUserDetails(): void {
    this.Auth.getUserDetails().subscribe({
      next: (data) => {
        console.log('userdata', data);
        this.userDetails = data;
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }

  fetchAllUsers(): void {
    this.Auth.getALLUsers().subscribe({
      next: (data: any) => {
        this.allUsers = data;
        this.sortUsers();
      },
      error: (error) => {
        console.error('Error fetching all users:', error);
      },
    });
  }

  sortUsers(): void {
    if (this.userDetails) {
      const currentUserIndex = this.allUsers.findIndex(
        (user) => user.id === this.userDetails?.id
      );
      if (currentUserIndex > -1) {
        const currentUser = this.allUsers.splice(currentUserIndex, 1)[0]; // Remove current user
        this.allUsers.unshift(currentUser); // Add current user at the top
      }
    }
  }

  editUser(user: any): void {
    console.log('in edit', user);
    this.router.navigate(['/register'], { state: { user, isEditMode: true } });
  }

  removeUser(user: any): void {
    this.Auth.deleteUser(user.id).subscribe({
      next: (response) => {
        alert("user deleted successfully");
        if (this.userDetails?.type === 'user') {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
        else
        {
          this.fetchAllUsers();
          }
      }
    });

  }

  navigateToPage1(): void {
    this.router.navigate(['/page1'], {
      queryParams: { role: this.userDetails?.type},
    });
  }

  navigateToPage2(): void {
    this.router.navigate(['/page2'], {
      queryParams: { role: this.userDetails?.type },
    });
  }

  trackByUserId(index: number, user: any): number {
    return user.id; // Use user.id to uniquely identify each user
  }

  trackByAddressId(index: number, address: any): number {
    return address.id; // Use address.id to uniquely identify each address
  }

  downloadExcel(): void {
    if (!this.allUsers || this.allUsers.length === 0) {
      console.error('No user data available for download');
      return;
    }

    // Convert the allUsers array to a format suitable for Excel
    const ws = XLSX.utils.json_to_sheet(
      this.allUsers.map((user) => ({
        ID: user.id,
        Name: user.name,
        Email: user.email,
        Password: user.password,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users'); // Add sheet with users data

    // Generate Excel file and prompt download
    XLSX.writeFile(wb, 'users-details.xlsx');
  }
}
