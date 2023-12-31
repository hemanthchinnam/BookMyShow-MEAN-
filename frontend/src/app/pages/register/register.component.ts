import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', [Validators.required, Validators.minLength(7)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(7)]],
    }, { validator: this.passwordsMatchValidator }); // Add a custom validator

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => {
      if (!x) {
        return;
      }
      this.form.patchValue({ name: x.name });
      this.form.patchValue({ email: x.email });

    });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')!.value;
    const repeatPassword = formGroup.get('repeatPassword')!.value;
    if (password !== repeatPassword) {
      return { passwordsNotMatch: true }; // Return a custom error object
    }
   
    return null;
  
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) { // Check for both built-in and custom validation
      return;
    }
    const { name, email, password, repeatPassword } = this.form.controls; // No need to access repeatPassword
    this.loading = true;
    this.authService.register(name.value, email.value, password.value, repeatPassword.value).subscribe(
      (data) => {
        this.router.navigate([this.returnUrl]);
        this.snackBar.open('Register  successfully', '', {
          panelClass: 'success-snackbar',
        });
        this.loading = false;
      },
      (error) => {
        this.snackBar.open(error, '', { panelClass: 'error-snackbar' });
        this.loading = false;
      }
    );
  }
}