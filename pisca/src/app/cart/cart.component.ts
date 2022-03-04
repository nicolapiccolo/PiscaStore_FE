import { Component, OnInit } from '@angular/core';
import {Product} from "../model/product";
import {CartService} from "../service/cart.service";
import {ProductService} from "../service/product.service";
import {LoadingService} from "../service/loading.service";
import {ActivatedRoute, Router} from "@angular/router";
import {formatNumber} from "@angular/common";
import {TokenStorageService} from "../service/token-storage.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  products?: Array<Product>;
  isEmpty = true;
  size = this.products?.length;
  loading$ = this.loader.loading$;
  strTotal = ""
  totalPrice: number = 0


  constructor(public loader: LoadingService,
              private route: ActivatedRoute,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private cartService: CartService) {

  }


  ngOnInit(): void {
    this.products = this.tokenStorage.getProduct()
    if (this.products!!.length>0){
      this.isEmpty = false;
      this.size = this.products?.length;
      this.getTotalItems();
      this.getTotalPrice();
    }
  }

  getTotalItems(): string{
    this.strTotal = this.size+" item"
    if(this.size!! > 1) this.strTotal += "s"
    return this.strTotal
  }

  getTotalPrice(){
    this.totalPrice = 0
    for(let product of this.products!!){
        this.totalPrice += Number(product.price)
    }
  }

  removeItem(product: Product){
    this.cartService.setProducts(product)
    this.ngOnInit()
    window.location.reload()
  }

  createOrder(){

  }

}
