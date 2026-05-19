import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';


@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.scss']
})

export class NavmenuComponent {
  constructor(private router: Router,
        private sharedDataService: SharedDataService) {}

  collapsed = false;

  toggle() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('Role');
    this.sharedDataService.changeUserData('');
          
    this.router.navigate(['/auth/login']);
  }
}
