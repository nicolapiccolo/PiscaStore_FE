export class Address{
  street: string = "";
  city: string = "";
  country: string = "";
  zipCode: string = "";


  constructor(street: string, city: string, country: string, zipCode: string) {
    this.street = street;
    this.city = city;
    this.country = country;
    this.zipCode = zipCode;
  }

  toString(): string{
    return this.street.toString() + "\n" + this.city.toString() + ", " + this.zipCode.toString() +  "\n" + this.country.toString()
  }
}
