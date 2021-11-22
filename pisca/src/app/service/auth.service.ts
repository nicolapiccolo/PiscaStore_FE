import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Address} from "../model/address";
import {FormGroup} from "@angular/forms";

const AUTH_API = 'http://localhost:8080/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
    console.log('ciao')
  }

  getAddresses(): Observable<any>{
    return this.http.get(AUTH_API + 'user/addresses');
  }


  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);

  }

  register(name: string, surname:string, username: string, email: string, password: string, phone: string, address: Address): Observable<any> {

    var addresses : Address[] =  [address];

    var formData: any = new FormData();


    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("email", surname);
    formData.append("phone", surname);
    formData.append("password", surname);
    formData.append("addresses", JSON.stringify(addresses));

    console.log(formData);


    return this.http.post(AUTH_API + 'signup', {
      name,
      surname,
      username,
      email,
      password,
      phone,
      addresses
    }, httpOptions);

  }
}
