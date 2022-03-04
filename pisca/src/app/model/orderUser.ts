import {Item} from "./item";

export class OrderUser{

  id_user: number = 0;
  items: Array<Item> = [];


  constructor(id_user: number, items: Array<Item>){
    this.id_user = id_user;
    this.items = items;
  }


}
