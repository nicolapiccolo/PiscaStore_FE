import { Injectable } from '@angular/core';
import {Product} from "../model/product";
import {TokenStorageService} from "./token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  products: Array<Product> = new Array<Product>();

  constructor(private tokenStorage: TokenStorageService) {
  }

  addToCart(product: Product){
    console.log(this.products)

    if(this.tokenStorage.getProduct() != null){
      this.products = this.tokenStorage.getProduct()
      const present = this.checkIfPresent(product.id)
      if(!present) this.products.push(product)
      this.tokenStorage.saveProduct(this.products)
      return !present
    }else{
      this.products.push(product)
      this.tokenStorage.saveProduct(this.products)
      return true
    }
  }

  getProducts(){
    return this.tokenStorage.getProduct()
  }

  setProducts(product: Product){
    const index: number = this.products!!.indexOf(product)
    this.products?.splice(index, 1)
    this.tokenStorage.saveProduct(this.products)
    console.log("SET:",this.products)
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
