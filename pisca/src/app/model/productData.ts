import {Product} from "./product";

export class ProductData{
  product: Product | undefined;
  id_author: number;
  category: string;

  constructor (product: Product, id_author: number, category: string){
    this.product = product;
    this.id_author = id_author;
    this.category = category;
  }

}
