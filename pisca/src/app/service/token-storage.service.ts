import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Product} from "../model/product";
import {Address} from "../model/address";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const CART_KEY = 'auth-cart';
const ADDRESS_KEY = "address";

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  public jwtHelper: JwtHelperService = new JwtHelperService();


  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveProduct(product: Array<Product>){
    window.localStorage.removeItem(CART_KEY)
    window.localStorage.setItem(CART_KEY, JSON.stringify(product))
    this.removeAddress();
    console.log(this.getProduct())
  }

  public getProduct(): any{
    const prod = window.localStorage.getItem(CART_KEY)
    return JSON.parse(prod!!)
  }

  public saveAddress(address: Address){
    window.localStorage.removeItem(ADDRESS_KEY);
    window.localStorage.setItem(ADDRESS_KEY,JSON.stringify(address));
  }

  public getAddress(): Address|undefined{
    const address = window.localStorage.getItem(ADDRESS_KEY);
    if(address!=null){
      const a = JSON.parse(address!!)
      return new Address(a.id,a.street,a.city,a.country,a.zipCode);
    }
    else return undefined
  }

  public removeAddress(){
    window.localStorage.removeItem(ADDRESS_KEY)
  }

  public removeProduct(){
    window.localStorage.removeItem(CART_KEY)
  }

  public isValid(): boolean{
    const token =  window.localStorage.getItem(TOKEN_KEY)
    console.log(token)

    if(token!=null){
      const expired = this.jwtHelper.isTokenExpired(token)
       if(expired) this.signOut()
      return !expired
    }
    else return false
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
