import {Author} from "./author";
import {Category} from "./category";
import {Product} from "./product";

export class ProductData{
  product: Product | undefined;
  author: Author | undefined;
  category: Category | undefined;

  constructor (product: Product, author: Author, category: Category){
    this.product = product;
    this.author = author;
    this.category = category;
  }

}
