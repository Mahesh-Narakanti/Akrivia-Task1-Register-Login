import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { AuthService } from 'C:/Users/akrivia/UserWeb/frontend/src/app/auth.service'; 
import { Observable } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone:true,
  imports:[ReactiveFormsModule, NgIf, RouterLink, NgFor],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]],
      addresses:this.fb.array([]),
      languages:this.fb.array([])
    });
  }

  passwordMatchValidator(control: any): { [key: string]: boolean } | null {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  get addresses(): FormArray{
    return this.registerForm.controls['addresses'] as FormArray;
  }

  get languages(): FormArray{
    return this.registerForm.get('languages') as FormArray;
  }

  addAddress(){
    console.log(this.registerForm)
    const adds=this.fb.group({
      addressLine:['',Validators.required],
      city:['',Validators.required],
      postalcode:['',Validators.required]
    });
    this.addresses.push(adds);
  }

  removeAddress(i:number):void{
    this.addresses.removeAt(i);
  }

  addLanguage():void{
    this.languages.push(this.fb.group({
      language:['',Validators.required]
    }))
  }
  removeLanguage(i:number):void{
    this.languages.removeAt(i);
  }
  onRegister(): Observable<any> {
    if (this.registerForm.invalid) {
      alert("Please enter the details correctly");
      return new Observable();  
    }

    const userDetails = this.registerForm.value;
    return this.authService.register(userDetails.username, userDetails.email, userDetails.password, userDetails.addresses, userDetails.languages);
  }

  handleRegister() {
    this.onRegister().subscribe({
      next: (response) => {
        alert("Registration completed successfully");
        console.log('Registration successful:', response);
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        alert("Registration Failed");
        console.log('Registration failed:', error);
      },
      complete: () => {
        console.log('Registration process completed');
      }
    });
  }
}
