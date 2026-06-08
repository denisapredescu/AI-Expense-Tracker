import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from '../models/CategoryModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
public url = "https://localhost:44386/Category";
    constructor( private http: HttpClient) { }
  
    getAll(): Observable<CategoryModel[]> {
      return this.http.get<CategoryModel[]>(`${this.url}/getAll`);
    }
}
