export class Order{

  id:number = 0
  id_user: number = 0;
  price: number = 0;
  items: Array<number> = [];


  constructor(id_user: number, items: Array<number>, price: number){
    this.id_user = id_user;
    this.items = items;
    this.price = price;
  }
}
