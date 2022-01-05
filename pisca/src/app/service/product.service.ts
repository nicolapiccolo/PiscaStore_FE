import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const API_URL = 'http://localhost:8080/catalog/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  /*
  "id": 2,
  "name": "Piatto Greco",
  "description": "Piatto molto antico dell'era greca",
  "dimensions": "56x79",
  "price": 45.56,
  "image": "",
  "available": true
  */

  public findByCategory(id: number): Observable<any> {
    return this.http.get<any>(API_URL + "catalog/category/"+id,httpOptions);
  }



  public findAll(): Observable<any> {
    return this.http.get<any>(API_URL + "catalog",httpOptions);
  }


  public findById(id: number): Observable<any> {
    return this.http.get<any>(API_URL + "products/" + id,httpOptions)
  }

}
