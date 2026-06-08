import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//share-uiesc emailul intre componente care nu au nicio legatura: Book, Login => am nevoie de email 
//pentru a putea vedea comenzile facute in trecut de user, cosul, pentru a adauga carti in cos


export class SharedDataService {

  private emailSource = new BehaviorSubject<string>(
  localStorage.getItem('email') ?? ''
);
  public currentEmailUser = this.emailSource.asObservable();

  constructor() {
  console.log('SharedDataService CREATED'); }

  public changeUserData(email : string): void {
    this.emailSource.next(email);
  }

  public get currentEmail(): string {
    return this.emailSource.value;
  }
}