import {Item} from "./item";
import {Product} from "./product";
import {Address} from "./address";

export class OrderUser{

  id: number = 0;
  id_address: number = 0;
  id_user: number = 0;
  items: Array<Item> = [];
  creation: Date = new Date();

  products: Array<Product> = [];
  total: number = 0;
  address?: Address;

  constructor(id_user: number, id_address: number, items: Array<Item>){
    this.id_user = id_user;
    this.id_address = id_address;
    this.items = items;
  }

  formatDate(date: Date){

  }


}
