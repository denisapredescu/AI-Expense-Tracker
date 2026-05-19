import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//share-uiesc emailul intre componente care nu au nicio legatura: Book, Login => am nevoie de email 
//pentru a putea vedea comenzile facute in trecut de user, cosul, pentru a adauga carti in cos


export class SharedDataService {

  private emailSource =  new BehaviorSubject('none email');
  public currentEmailUser = this.emailSource.asObservable();

  constructor() { }

  public changeUserData(email : string): void {
    this.emailSource.next(email);
  }
}