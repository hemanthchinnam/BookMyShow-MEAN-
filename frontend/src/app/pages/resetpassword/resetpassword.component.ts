// resetpassword.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent {
  email: string = '';
  resetToken: string = '';
  newPassword: string = '';
  resetSuccessful: boolean = false;
  resetForm: FormGroup; // Define a FormGroup

  constructor(
    private passwordService: PasswordService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder // Inject the FormBuilder
  ) {
    this.route.queryParams.subscribe((params) => {
      this.email = params.email || '';
      this.resetToken = params.token || '';
    });

    // Initialize the form with validators
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      resetPasswordToken: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(7)]],
    });
    
  }
  isFieldInvalid(field: string) {
    return this.resetForm.get(field)!.invalid && this.resetForm.get(field)!.touched;
  }

  isFieldTouched(field: string) {
    return this.resetForm.get(field)!.touched;
  }
  resetPassword() {
    // Check if the form is valid before making the API call
    if (this.resetForm.valid) {
      this.passwordService.resetPassword({
        email: this.resetForm.value.email,
        resetPasswordToken: this.resetForm.value.resetPasswordToken,
        password: this.resetForm.value.newPassword,
      }).subscribe(
        (response) => {
          console.log(response.message);
          this.resetSuccessful = true;
          alert(response.message)
        },
        (error) => {
          console.error(error.message);
        }
      );
    }
  }
}