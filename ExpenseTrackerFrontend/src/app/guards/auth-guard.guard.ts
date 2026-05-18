import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
  ) {
  }
  
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     const isAuthorized = !(localStorage.getItem('accessToken') === ''); // are voie sa intre doar daca este logat, deci daca exista in localStorage un accesToken, indiferent de valoarea lui
                                                                        //pentru intrarea in Order si Basket
    if (!isAuthorized) {
      console.error('You are not login!!');
      this.router.navigate(['/auth']);
    }
    return true ; //isAuthorized;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}