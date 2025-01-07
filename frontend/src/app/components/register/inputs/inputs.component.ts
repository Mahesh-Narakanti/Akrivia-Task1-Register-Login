import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inputs',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css'],
})
export class InputsComponent {
  @Input() registerForm!: FormGroup; // Receive formGroup from parent
  @Output() formUpdated = new EventEmitter<FormGroup>(); // Emit changes to parent

  get addresses(): FormArray {
    return this.registerForm.get('addresses') as FormArray;
  }

  get languages(): FormArray {
    return this.registerForm.get('languages') as FormArray;
  }

  // Method to notify the parent when a change occurs
  notifyParent() {
    this.formUpdated.emit(this.registerForm); // Emit the updated form
  }

  // Method to add a new address
  addAddress(): void {
    const address = this.registerForm.get('addresses') as FormArray;
    address.push(
      this.registerForm.get('address') // Mock your actual method to add a new address.
    );
    this.notifyParent();
  }

  // Method to remove address
  removeAddress(index: number): void {
    const addresses = this.registerForm.get('addresses') as FormArray;
    addresses.removeAt(index);
    this.notifyParent();
  }

  // To add language
  addLanguage() {
    const language = this.registerForm.get('languages') as FormArray;
    language.push(this.registerForm.get('language')!);
    this.notifyParent();
  }


  removeLanguage(i: number): void {
    const languages = this.registerForm.get('languages') as FormArray;
    languages.removeAt(i);
    this.notifyParent();
  }
}
