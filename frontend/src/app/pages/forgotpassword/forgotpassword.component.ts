import { Component } from '@angular/core';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  email: string = '';
  emailPattern: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  constructor(private passwordService: PasswordService) {}

  forgotPassword() {
    if (!this.emailPattern.test(this.email)) {
      alert('Invalid email format. Please enter a valid email address.');
      return; // Stop execution if the email is not valid
    }

    this.passwordService.forgotPassword(this.email).subscribe(
      (response) => {
        console.log(response.message);
        alert(response.message);
        // Handle success (e.g., show a success message to the user)
      },
      (error) => {
        console.error(error.message);
        // Handle error (e.g., show an error message to the user)
      }
    );
  }
}
