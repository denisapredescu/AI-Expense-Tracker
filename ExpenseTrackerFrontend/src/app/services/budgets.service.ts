import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BudgetModel } from '../models/BudgetModel';

@Injectable({
  providedIn: 'root',
})

export class BudgetsService {
  public url = 'https://localhost:44386/Budget';
  constructor(private http: HttpClient) { }

  saveBudget(budget: BudgetModel): Observable<any> {
    return this.http.post(`${this.url}/Save`, budget);
  }

  updateBudget(budget: BudgetModel): Observable<any> {
    return this.http.post(`${this.url}/Update`, budget);
  }

  deleteBudget(budgetId: number): Observable<any> {
    return this.http.delete(`${this.url}/Delete?budgetId=${budgetId}`);
  }

  getAll(userEmail: string): Observable<BudgetModel[]> {
    return this.http.get<BudgetModel[]>(`${this.url}/GetAll?userEmail=${userEmail}`);
  }
}
