import { Component, OnInit } from '@angular/core';
import {Product} from "../model/product";
import {ProductService} from "../service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthorService} from "../service/author.service";
import {CategoryService} from "../service/category.service";
import {ProductData} from "../model/productData";
import {Author} from "../model/author";
import {LoadingService} from "../service/loading.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productData: ProductData = {product:undefined,category:undefined,author:undefined};
  errorMessage = "";

  loading$ = this.loader.loading$;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private authorService: AuthorService,
              private categoryService: CategoryService,
              public loader: LoadingService) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if(id){
      this.productService.findById(id).subscribe(data => {
          //this.productData = new ProductData(data.product,this.getAuthor(data.id_author),this.getCategory(data.category))
          //console.log(data)
          this.productData.product = data.product;
          this.getAuthor(data.id_author);
          this.getCategory(data.category);
      })
    }
  }

  getAuthor(id: number): void {
    this.authorService.findById(id).subscribe(data => {
      console.log("Author ",data)
      this.productData.author = data;
    })
  }

  getCategory(name: string): void {
    this.categoryService.findByName(name).subscribe(data => {
      console.log("Category ",data)
      this.productData.category = data;
    })
  }



  onBack(): void {
    this.router.navigate(['/catalog']);
  }

}
