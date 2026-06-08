import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from 'src/app/models/RegisterModel';
import { AuthService } from 'src/app/services/auth.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-register',
  // standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../auth/auth.component.scss'],
    // imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
    public registerForm: any = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  public error : string | boolean = false;

  constructor(
      private authService: AuthService,
      private router: Router,
      private sharedDataService: SharedDataService
    ) { }

    passwordsMatch(): boolean {
      console.log(this.registerForm.password);
console.log(this.registerForm.confirmPassword);

  return this.registerForm.password === this.registerForm.confirmPassword;
}
  
submitRegister() {
       console.log("Register clicked");
       const registerModel: RegisterModel = {
      email: this.registerForm.email,
      password: this.registerForm.password,
      role: 'User' 
    };
       
    this.authService.register(registerModel).subscribe(
      (response) =>{
      console.log(response);
      
            this.router.navigate(['/auth/login']);
    },
    (error) =>{
      this.error = "Unable to register user! Please try again!"; 
      console.error(error);
      alert("Unable to register user! Please try again! Error:" + error.message);
    }
    );
    }
}
