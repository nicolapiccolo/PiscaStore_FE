import { Component, OnInit } from '@angular/core';
import {Product} from "../model/product";
import {CartService} from "../service/cart.service";
import {ProductService} from "../service/product.service";
import {LoadingService} from "../service/loading.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  products?: Array<Product>;
  isEmpty = false;

  loading$ = this.loader.loading$;



  constructor(public loader: LoadingService,
              private route: ActivatedRoute,
              private router: Router,
              private cartService: CartService) {

  }


  ngOnInit(): void {
    this.products = this.cartService.getProducts()
  }

  createOrder(){

  }

}
