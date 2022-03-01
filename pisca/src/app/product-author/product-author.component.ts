import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../service/product.service";
import {AuthorService} from "../service/author.service";
import {CategoryService} from "../service/category.service";
import {LoadingService} from "../service/loading.service";
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import {Product} from "../model/product";
import {AccountService} from "../service/account.service";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-product-author',
  templateUrl: './product-author.component.html',
  styleUrls: ['./product-author.component.css']
})
export class ProductAuthorComponent implements OnInit {

  products?: Product[];

  currentUser: number = 0

  isEmpty = false

  loading$ = this.loader.loading$;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private authorService: AuthorService,
              private accountService: AccountService,
              private categoryService: CategoryService,
              public loader: LoadingService,
              config: NgbCarouselConfig) {

    config.interval =10000;
    config.keyboard = true;
    config.pauseOnHover = true;
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
        this.getAllProduct(this.currentUser)
      }},
      (err:any)=>{
        console.log(err)
        this.currentUser = 0
        console.log("cannot retrive user")
        this.router.navigateByUrl("/login")
      });
  }

  getAllProduct(id_author: number){
    this.productService.findByAuthorId(id_author).subscribe(data=>{
      console.log("products: ",data)
      if(data.length>0){
        this.products = data
      }
      else this.isEmpty=true
    })

  }

}
