import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../service/product.service";
import {AuthorService} from "../service/author.service";
import {AccountService} from "../service/account.service";
import {CategoryService} from "../service/category.service";
import {LoadingService} from "../service/loading.service";
import {NgbCarouselConfig, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {OrderUser} from "../model/orderUser";
import {OrderService} from "../service/order.service";
import {Product} from "../model/product";
import {Address} from "../model/address";

@Component({
  selector: 'app-profile-orders',
  templateUrl: './profile-orders.component.html',
  styleUrls: ['./profile-orders.component.css']
})
export class ProfileOrdersComponent implements OnInit {


  isEmpty = false; //lista ordini

  orders = new Array<OrderUser>();
  loading$ = this.loader.loading$;

  currentUser = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private accountService: AccountService,
              private orderService: OrderService,
              public loader: LoadingService,
              private modalService: NgbModal){
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser().subscribe(
      (data: any) => {
        console.log("user: ", data)
        if (data <= 0 || data == undefined || data == null) {
          this.currentUser = 0
          console.log("cannot retrive user")
        }
        else{
          this.currentUser = data
          this.getAllOrders(data);

          //this.getAllProduct(this.currentUser)
        }},
      (err:any)=>{
        console.log(err)
        this.currentUser = 0
        console.log("cannot retrive user")
        this.router.navigateByUrl("/login")
      });
  }

  private async getAllOrders(user: number){
    this.orderService.findByUser(user).subscribe( async data=>{
      console.log(data)
      this.orders = data

      for(let order of this.orders){
        let products = new Array<Product>();
        for(let item of order.items){
          console.log(item)
          const p = await this.getProduct(item.id_product);
          console.log("Product: ", p)
          products.push(new Product(p.product.id,p.product.name,p.product.description,p.product.dimensions,p.product.price,true,p.product.image));
          //order.products.push(p)
        }
        order.products = products;
        order.total = this.getTotalPrice(products);

        const add = await this.getAddress(order.id_address)
        if(add!=null){
          order.address = add;
        }

      }
    },
    err=>{
      console.log(err)
    })
  }

  private async getProduct(product: number){
    const data = await this.productService.findById(product).toPromise();
    return data
  }

  private async getAddress(address: number){
    const data = await this.accountService.getAddressById(address).toPromise();
    if(data!=null){
      return new Address(data.id,data.street,data.city,data.country,data.zipCode)
    }
    return null
  }

  private getTotalPrice(products: Product[]) : number {
    let total = 0
    for (let product of products) {
      total += Number(product.price)
    }
    return total;
  }

}
