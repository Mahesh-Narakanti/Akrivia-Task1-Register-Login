import { CommonModule, NgFor, NgIf, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { UserDetails } from '../../interfaces/user-details';
import { AllUsers } from '../../interfaces/user';
import * as XLSX from 'xlsx';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { response } from 'express';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, ScrollingModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private userDetailsSubject = new BehaviorSubject<UserDetails | null>(null);
  userDetails$ = this.userDetailsSubject.asObservable(); // Observable signal for userDetails

  private allUsersSubject = new BehaviorSubject<AllUsers[]>([]);
  allUsers$ = this.allUsersSubject.asObservable(); // Observable signal for allUsers

  tokenExpired: boolean = false;

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 10;
  totalUsers: number = 0;

  constructor(
    private Auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdref: ChangeDetectorRef
  ) {}

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
        this.userDetailsSubject.next(data); // Update userDetails signal
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }

  fetchAllUsers(
    page: number = this.currentPage,
    limit: number = this.pageSize
  ): void {
    this.Auth.getALLUsers(page, limit).subscribe({
      next: (data: any) => {
        this.allUsersSubject.next(data.users); // Update the users list
        this.totalUsers = data.total; // Update the total user count
        this.currentPage = data.page; // Update current page
        this.sortUsers();
      },
      error: (error) => {
        console.error('Error fetching all users:', error);
      },
    });
  }

  onPageChange(page: number): void{
    this.fetchAllUsers(page);
  }

  sortUsers(): void {
    const currentUser = this.userDetailsSubject.value;
    if (currentUser) {
      const currentUserIndex = this.allUsersSubject.value.findIndex(
        (user) => user.id === currentUser.id
      );
      if (currentUserIndex > -1) {
        const currentUser = this.allUsersSubject.value.splice(
          currentUserIndex,
          1
        )[0]; // Remove current user
        this.allUsersSubject.next([currentUser, ...this.allUsersSubject.value]); // Add current user at the top
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
        alert('user deleted successfully');
        if (this.userDetailsSubject.value?.type === 'user') {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.removeItem('token');
          }
          this.router.navigate(['/login']);
        } else {
          this.fetchAllUsers(); // Re-fetch after deletion
        }
      },
    });
  }

  navigateToPage1(): void {
    this.router.navigate(['/page1'], {
      queryParams: { role: this.userDetailsSubject.value?.type },
    });
  }

  navigateToPage2(): void {
    this.router.navigate(['/page2'], {
      queryParams: { role: this.userDetailsSubject.value?.type },
    });
  }

  trackByUserId(index: number, user: any): number {
    return user.id; // Use user.id to uniquely identify each user
  }

  trackByAddressId(index: number, address: any): number {
    return address.id; // Use address.id to uniquely identify each address
  }

  downloadExcel(): void {

    this.Auth.getAllData().subscribe({
      next: (response : AllUsers[]) => {
        const ws = XLSX.utils.json_to_sheet(
          response.map((user :AllUsers) => ({
            ID: user.id,
            Name: user.name,
            Email: user.email,
            Password: user.password,
          }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users'); // Add sheet with users data

        XLSX.writeFile(wb, 'users-details.xlsx');
      }
    });
  }
}
