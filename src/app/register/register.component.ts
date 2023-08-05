import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userSuccess: boolean = false;
  name?: any;
  email?: any;
  password?: any;
  confirmPassword?: any;
  formReset?: any;
  errorMessage?: any;
  isError: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  modalHandler() {
    this.userSuccess = !this.userSuccess;
  }

  submitHandler($event: any) {
    $event.preventDefault();

    this.name = document.getElementById('name');
    const nameValue = this.name.value;

    if (!nameValue) {
      this.isError = true;
      this.errorMessage = 'Name is required!';
      return;
    }

    this.email = document.getElementById('email');
    const emailValue = this.email.value;

    if (!emailValue) {
      this.isError = true;
      this.errorMessage = 'Email is required!';
      return;
    }

    this.password = document.getElementById('password');
    const passwordValue = this.password.value;

    if (!passwordValue) {
      this.isError = true;
      this.errorMessage = 'Password is required!';
      return;
    }

    this.confirmPassword = document.getElementById('confirmPassword');
    const confirmPasswordValue = this.confirmPassword.value;

    if (!confirmPasswordValue) {
      this.isError = true;
      this.errorMessage = 'Password is required!';
      return;
    }

    this.userService
      .createUser(nameValue, emailValue, passwordValue, confirmPasswordValue)
      .subscribe({
        next: (userData: any) => {
          this.formReset = document.getElementById('myForm');
          this.formReset.reset();

          this.isError = false;
          this.userSuccess = true;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (error: any) => {
          // error.message izhaja iz .pipe (catchError) funkcije, kjer smo samostojno definirali "message" lastnost
          console.log(error);
          this.errorMessage = error.message;
          this.isError = true;
        },
      });
  }
}
