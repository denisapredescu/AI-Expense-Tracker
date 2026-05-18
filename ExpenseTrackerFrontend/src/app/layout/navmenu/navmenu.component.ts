import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.scss']
})

export class NavmenuComponent {
  constructor(private router: Router) {}

  collapsed = false;

  toggle() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
