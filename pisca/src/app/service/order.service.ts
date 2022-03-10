import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";
import { Observable } from 'rxjs';
import {Order} from "../model/order";
import {Item} from "../model/item";
import {OrderUser} from "../model/orderUser";
import {Address} from "../model/address";



const API_URL = 'http://localhost:8080/order/api/v1/bag/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  address?: Address;

  constructor(private http: HttpClient) {}

  public setAddress(address: Address){
    this.address = address;
  }

  public getAddress(){
    return this.address;
  }

  public findById(id: number): Observable<any> {
    return this.http.get<any>(API_URL + "order/" + id,httpOptions)
  }


  public create(order: OrderUser){
    const req = new HttpRequest('POST', `${API_URL}create`, order, {
      reportProgress: true,
      responseType: 'json'
    });
    console.log(req)
    return this.http.request(req)
  }

  public payment(totalAmount: number){
    return this.http.post<any>(API_URL + "payment?totalAmount="+totalAmount,{responseType: 'text'})
  }

  public capture(token: string){
    const requestOptions: Object = {
      /* other options here */
      responseType: 'text'
    }
    return this.http.get<any>(API_URL+"capture?token="+token,requestOptions)
  }

}
