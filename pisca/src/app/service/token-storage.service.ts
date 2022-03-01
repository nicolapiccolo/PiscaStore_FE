import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

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
