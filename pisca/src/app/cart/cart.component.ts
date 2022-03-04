import { Component, OnInit } from '@angular/core';
import {Product} from "../model/product";
import {CartService} from "../service/cart.service";
import {ProductService} from "../service/product.service";
import {LoadingService} from "../service/loading.service";
import {ActivatedRoute, Router} from "@angular/router";
import {formatNumber} from "@angular/common";

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
  totalPrice = ""


  constructor(public loader: LoadingService,
              private route: ActivatedRoute,
              private router: Router,
              private cartService: CartService) {

  }


  ngOnInit(): void {
    this.products = this.cartService.getProducts()
    if (this.products.length>0){
      this.isEmpty = false;
      this.size = this.products?.length;
      this.getTotalItems();
      this.getTotalPrice();
    }
    console.log(this.isEmpty)
  }

  getTotalItems(): string{
    this.strTotal = this.size+" item"
    if(this.size!! > 1) this.strTotal += "s"
    return this.strTotal
  }

  getTotalPrice(){
    for(let product of this.products!!){
        this.totalPrice += product.price

    }
  }

  removeItem(product: Product){
    const index: number = this.products!!.indexOf(product)
    this.products?.splice(index, 1)
    console.log(this.products?.length)
    window.location.reload()
  }

  createOrder(){

  }

}
