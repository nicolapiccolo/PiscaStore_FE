import {Author} from "./author";
import {Category} from "./category";

export class Product{
  id:number = 0
  name: string = "";
  description: string = "";
  dimensions: string = "";
  price: string = "";
  available: boolean = true;
  image: string = "";
  image2: string = "";
  image3: string = "";
  image4: string = "";




  /*
  "id": 2,
  "name": "Piatto Greco",
  "description": "Piatto molto antico dell'era greca",
  "dimensions": "56x79",
  "price": 45.56,
  "image": "",
  "available": true
  */

  constructor(id:number,name: string, description: string, dimensions: string, price: string, available: boolean, image: string, image2: string = '', image3: string = '' , image4: string = '') {
    this.id = id;
    this.name = name;
    this.description = description;
    this.dimensions = dimensions;
    this.price = price;
    this.available = available;
    this.image = image;
    this.image2 = image2;
    this.image3 = image3;
    this.image4 = image4;

  }

  toString(): string{
    return this.name.toString() + "\n" + this.description.toString() + ", " + this.dimensions.toString() +  "\n" + this.price.toString()
  }
}
