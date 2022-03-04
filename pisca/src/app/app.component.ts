import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "./service/token-storage.service";
import {CartService} from "./service/cart.service";
import {ProductDetailsComponent} from "./product-details/product-details.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private roles: string[] = [];
  title = 'pisca'
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  bagItems = 0;

  constructor(private tokenStorageService: TokenStorageService, private cartService: CartService) { }

  ngOnInit(): void {

    this.isLoggedIn = this.tokenStorageService.isValid()
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');

      this.username = user.username;

      this.bagItems = this.cartService.getSize();
    }
  }

  refresh(path: string): void{
    if (window.location.pathname.toString() == path){
      window.location.reload()
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();

    window.location.reload();
  }

  updateSize(bagItems: number): void{
    this.bagItems = bagItems
  }

  receiveEvent($event: number){
    console.log("bag ",$event)
    this.updateSize($event)
  }

  color(){

  }
}
