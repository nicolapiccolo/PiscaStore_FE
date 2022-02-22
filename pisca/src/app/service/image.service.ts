import { Injectable } from '@angular/core';
import {Category} from "../model/category";
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const API_URL = 'http://localhost:8080/catalog/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}


  public findByName(name: string): Observable<any> {
    return this.http.get<any>(API_URL + "image/" + name,httpOptions)
  }

  public upload(file: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${API_URL}image/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
  }

}
