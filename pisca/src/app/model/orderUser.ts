import {Item} from "./item";

export class OrderUser{

  id_address: number = 0;
  id_user: number = 0;
  items: Array<Item> = [];


  constructor(id_user: number, id_address: number, items: Array<Item>){
    this.id_user = id_user;
    this.id_address = id_address;
    this.items = items;
  }


}
