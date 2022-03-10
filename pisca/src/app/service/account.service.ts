import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';
import {Address} from "../model/address";

const AUTH_API = 'http://localhost:8081/account/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {
    console.log('Account Service')
  }

  getAddresses(): Observable<any>{
    let add = this.http.get(AUTH_API + 'address',httpOptions);
    console.log("indirizzi trovati ",add);
    return add;
  }

  setAddress(data: any): Observable<any>{
    console.log(data)
    return this.http.put(AUTH_API + 'create',data,httpOptions);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(AUTH_API + 'current', httpOptions);
  }

  updateUser(data: any) : Observable<any>{
    console.log(data)
    return this.http.put(AUTH_API + 'update',data,httpOptions);
  }
}
