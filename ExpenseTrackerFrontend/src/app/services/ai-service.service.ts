import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AiExpenseModel } from '../models/AiExpenseModel';

@Injectable({
  providedIn: 'root'
})
export class AiServiceService {

  public url = "https://localhost:44386/api/ai";
  constructor( private http: HttpClient) { }

  extract(userText: string): Observable<AiExpenseModel[]> {
    console.log("sunt aici cu textul meu", userText);

    return this.http.post<AiExpenseModel[]>(
      `${this.url}/extract`,
        { text: userText }
    );
  }

  saveAllExpenses(expenses: AiExpenseModel[]): Observable<any> {
    return this.http.post(`${this.url}/expenses/bulk`, expenses);
  }
}
