import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  submitted = false;
  onSubmit() { this.submitted = true; }



  public displayLogin: boolean = true;

  public error : string | boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedDataService: SharedDataService
  ) { }

  
  ngOnInit(): void {
  }
  
  showLogin() {
    this.displayLogin = true;
  }

    showRegister() {
      this.displayLogin = false;
    }

}

