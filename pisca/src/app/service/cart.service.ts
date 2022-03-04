import { Injectable } from '@angular/core';
import {Product} from "../model/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  products: Array<Product> = new Array()

  constructor() {
  }

  addToCart(product: Product){

    const present = this.checkIfPresent(product.id)
    console.log("check",present)
    if(!present) this.products.push(product)
    return !present
  }

  getProducts(){
    console.log(this.products)
    return this.products;
  }

  checkIfPresent(id : number): boolean{
    for (let i = 0; i < this.products.length; i++){
      if(this.products[i].id == id) return true
    }
    return false;
  }

  getSize(){
    return this.products.length;
  }
}
