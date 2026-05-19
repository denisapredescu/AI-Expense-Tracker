import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/LoginModel';
import { LoginResult } from '../models/LoginResult';
import { RegisterModel } from '../models/RegisterModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + localStorage.getItem('accessToken'))
  };

  public url = "https://localhost:44386/User";
  constructor(
    private http: HttpClient
    ) { }


  //observable => promisiuni
  public login(login : LoginModel): Observable<LoginResult>{
    console.log(login);
    return this.http.post<LoginResult>(`${this.url}/Login`, login);
  }
  
  public register(register: RegisterModel): Observable<any>{
    console.log(register);
    return this.http.post<any>(`${this.url}/Register`, register);
  }
}