import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8082/api/v1/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private http: HttpClient) {}

  public findById(id: number): Observable<any> {
    return this.http.get<any>(API_URL + "authors/" + id,httpOptions)
  }
}
