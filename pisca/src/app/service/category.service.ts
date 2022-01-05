import { Injectable } from '@angular/core';
import {Category} from "../model/category";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const API_URL = 'http://localhost:8082/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {}


  public findAll(): Observable<any> {
    return this.http.get<any>(API_URL + "categories");
  }

  public findById(id: number): Observable<any> {
    return this.http.get<any>(API_URL + "category",
      {  headers: new HttpHeaders({ 'Content-Type': 'application/json' }) ,params:{id}})
  }

  public findByName(name: string): Observable<any> {
    return this.http.get<any>(API_URL + "categories/" + name,httpOptions)
  }

}
