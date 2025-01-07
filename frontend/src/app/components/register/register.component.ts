import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { RegUser } from '../../interfaces/reguser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  userDetails: RegUser | null = null;
  isEditMode: boolean = false;
  profilePicture: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '',
        [Validators.required, this.passwordMatchValidator.bind(this)],
      ],
      addresses: this.fb.array([]),
      languages: this.fb.array([]),
      type: ['user', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get user data from router state if available
    const state = history.state;
    console.log(state?.['user']);
    if (state?.['user']) {
      this.userDetails = state?.['user'];
      this.isEditMode = state?.['isEditMode'] || false;
      this.profilePicture = this.userDetails?.profilePicture || null;
      this.populateForm();
    }
  }

  passwordMatchValidator(control: any): { [key: string]: boolean } | null {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get addresses(): FormArray {
    return this.registerForm.controls['addresses'] as FormArray;
  }

  get languages(): FormArray {
    return this.registerForm.get('languages') as FormArray;
  }

  addAddress() {
    const address = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    });
    this.addresses.push(address);
  }

  removeAddress(i: number): void {
    this.addresses.removeAt(i);
  }

  addLanguage(): void {
    this.languages.push(
      this.fb.group({
        language: ['', Validators.required],
      })
    );
  }

  removeLanguage(i: number): void {
    this.languages.removeAt(i);
  }

  trackByAddressId(index: number, address: any): number {
    return index;
  }

  trackByLanguageId(index: number, language: any): number {
    return index;
  }
  populateForm(): void {
    if (this.userDetails) {
      this.registerForm.patchValue({
        username: this.userDetails.name,
        email: this.userDetails.email,
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.profilePicture = reader.result as string; // Store Base64 string
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  }

  handleRegister(): void {
    if (this.registerForm.invalid) {
      alert('Please enter the details correctly');
      return;
    }
    const profilePictureBase64 = this.profilePicture;
    console.log('Profile Picture:', profilePictureBase64);
    if (this.isEditMode) {
      // Update user details in edit mode
      this.userDetails!.password = this.registerForm.value.password;
      this.userDetails!.email = this.registerForm.value.email;
      this.userDetails!.name = this.registerForm.value.username;

      this.authService
        .updateUser(
          this.userDetails!.id!,
          this.userDetails!.name,
          this.userDetails!.email,
          this.userDetails!.password,
          profilePictureBase64
        )
        .subscribe({
          next: (response) => {
            alert('User updated successfully');
            console.log('User update successful:', response);
            this.router.navigate(['/home']);
          },
          error: (error) => {
            alert('User update failed');
            console.log('User update failed:', error);
          },
        });
    } else {
      const userDetails = this.registerForm.value;

      this.authService
        .register(
          userDetails.username,
          userDetails.email,
          userDetails.password,
          userDetails.addresses,
          userDetails.languages,
          userDetails.type,
          profilePictureBase64
        )
        .subscribe({
          next: (response) => {
            alert('Registration completed successfully');
            console.log('Registration successful:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            alert('Registration Failed');
            console.log('Registration failed:', error);
          },
        });
    }
  }
}
