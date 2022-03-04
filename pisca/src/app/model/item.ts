export class Item {

  name: string = "";
  price: number = 0;
  id_product: number = 0;


  constructor(name: string, price: number, id_product: number) {
    this.name = name;
    this.price = price;
    this.id_product = id_product;
  }
}
