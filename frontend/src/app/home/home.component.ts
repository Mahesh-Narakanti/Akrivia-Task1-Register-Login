import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  imports: [NgIf,NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
   userDetails:any=null;
  constructor(private Auth:AuthService){  
    if(!this.userDetails)
      this.fetchUserDetails();
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
   // this.router.navigate(['/home']);
   }
}
