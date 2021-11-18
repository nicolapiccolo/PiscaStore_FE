import { Injectable } from '@angular/core';
import {Category} from "../model/category";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryUrl: string;

  constructor(private http: HttpClient) {
    this.categoryUrl = 'http://localhost:8080/category';
  }

  public findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  public save(category: Category) {
    return this.http.post<Category>(this.categoryUrl, category);
  }
}
