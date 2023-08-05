import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../global-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email?: any;
  password?: any;
  formReset?: any;
  errorMessage?: any;
  isError: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private globalService: GlobalServiceService
  ) {}

  submitHandler(event: any) {
    event.preventDefault();

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

    this.userService.loginUser(emailValue, passwordValue).subscribe({
      next: (userData) => {
        const jwtToken = userData.data.loginUser.token;
        const userId = userData.data.loginUser.userId;
        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('userId', userId);

        this.formReset = document.getElementById('myForm');
        this.formReset.reset();

        this.isError = false;
        this.globalService.updateIsLoggedIn(true);

        this.router.navigate(['/recipes'], {queryParams : {page : 1}});
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.message;
        this.isError = true;
      },
    });
  }
}
