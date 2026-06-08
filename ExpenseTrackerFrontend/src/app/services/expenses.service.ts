import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AiExpenseModel } from '../models/AiExpenseModel';
import { ExpenseModel } from '../models/ExpenseModel';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  public url = "https://localhost:44386/Expense";
    constructor( private http: HttpClient) { }
  
    saveAll(expenses: ExpenseModel[], userEmail: string): Observable<ExpenseModel[]> {
      // userEmail = "denisa@gmail.com";
      return this.http.post<ExpenseModel[]>(`${this.url}/SaveAll?userEmail=${userEmail}`,  expenses );
    }

      saveExpense(expense: ExpenseModel): Observable<ExpenseModel[]> {
      // expense.userEmail = "denisa@gmail.com";
      return this.http.post<ExpenseModel[]>(`${this.url}/Save`,  expense );
    }

    updateExpense(expense: ExpenseModel): Observable<ExpenseModel[]> {
        //  expense.userEmail = "denisa@gmail.com";

      return this.http.post<ExpenseModel[]>(`${this.url}/Update`,  expense );
    }

    deleteExpense(expense: ExpenseModel): Observable<ExpenseModel[]>{
        //  expense.userEmail = "denisa@gmail.com";
      return this.http.delete<ExpenseModel[]>(`${this.url}/Delete`, { body: expense });
    }

    getAll(userEmail: string): Observable<ExpenseModel[]> {
      // userEmail = "denisa@gmail.com";
      return this.http.get<ExpenseModel[]>(`${this.url}/GetAll?userEmail=${userEmail}`);
    }
}
