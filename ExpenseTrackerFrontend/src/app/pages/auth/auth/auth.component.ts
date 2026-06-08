import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {



  public formType: string = 'login';

  public error : string | boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedDataService: SharedDataService
  ) { }

  
  ngOnInit() {
  this.activatedRoute.data.subscribe(data => {
     this.formType = data['formType'];
  });
}
  
  showLogin() {
    this.router.navigate(['/auth/login']);
  }

    showRegister() {
      this.router.navigate(['/auth/register']);
    }

}

