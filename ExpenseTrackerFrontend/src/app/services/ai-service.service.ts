import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseModel } from '../models/ExpenseModel';
import { InsightsModel } from '../models/InsightsModel';

@Injectable({
  providedIn: 'root'
})

export class AiServiceService {
  public url = "https://localhost:44386/api/ai";
  constructor(private http: HttpClient) { }

  extract(userText: string): Observable<ExpenseModel[]> {
    return this.http.post<ExpenseModel[]>(
      `${this.url}/extract`,
      { text: userText }
    );
  }

  getInsights(userEmail: string, selectedMonth: Date): Observable<InsightsModel> {
    const year = selectedMonth.getFullYear();
    const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
    const day = String(selectedMonth.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return this.http.get<InsightsModel>(
      `${this.url}/getInsights?userEmail=${userEmail}&selectedMonth=${formattedDate}`
    );
  }
}
