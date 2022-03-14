import {Optional} from "@angular/core";

export class Address{
  id: number = 0
  street: string = "";
  city: string = "";
  country: string = "";
  zipCode: string = "";


  constructor(id: number, street: string, city: string, country: string, zipCode: string) {
    this.id = id;
    this.street = street;
    this.city = city;
    this.country = country;
    this.zipCode = zipCode;
  }


  toString(): string{
    if(this.street.length>0 && this.city.length>0 && this.country.length>0 && this.zipCode.length>0)
    return this.street.toString() + "<br>"+ this.city.toString() + ", " + this.zipCode.toString() +  "<br>" + this.country.toString()

    else return "";
  }
}
