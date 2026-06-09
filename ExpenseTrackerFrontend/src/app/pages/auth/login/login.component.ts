import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LoginResult } from 'src/app/models/LoginResult';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth/auth.component.scss'],
})

export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedDataService: SharedDataService
  ) { }

  public loginForm: any = {
    email: '',
    password: ''
  };
  public error: string | boolean = false;

  submitLogin() {
    if (this.loginForm.email && this.loginForm.password) {
      this.error = false;
      this.authService.login(this.loginForm).subscribe(
        (response: LoginResult) => {
          console.log(response);
          if (response.success) {
            //pastrez emailul pentru a-l share-ui cu celelalte componente
            this.sharedDataService.changeUserData(this.loginForm.email);

            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('email', this.loginForm.email);

            //determin doar rolul: imi trebuie ca sa stiu daca am voie sa inregistrez admini
            var RolePart = response.accessToken.split('.')[1];
            var decodedJwtJsonData = window.atob(RolePart);
            let decodedJwtData = JSON.parse(decodedJwtJsonData);

            var isAdmin = decodedJwtData.role;
            localStorage.setItem('Role', isAdmin);

            // this.error = "Login with succes!";
            this.router.navigate(['/dashboard']);
          }
          else
            this.error = "Something went wrong! Please try again!";
        },
        (error) => {
          this.error = "Unable to login user! Please try again! Error message:" + error.error
          console.error(error);
          // alert("Unable to login user! Please try again! Error:" + error.error);
        }
      );
    }
    else {
      this.error = "Invalid email or password!";
    }
  }
}
