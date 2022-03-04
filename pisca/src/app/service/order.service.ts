import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from "@angular/common/http";
import { Observable } from 'rxjs';
import {Order} from "../model/order";
import {Item} from "../model/item";
import {OrderUser} from "../model/orderUser";



const API_URL = 'http://localhost:8080/order/api/v1/bag/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {}

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
}
