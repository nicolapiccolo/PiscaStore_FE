import { Component, OnInit } from '@angular/core';
import {Product} from "../model/product";
import {ProductService} from "../service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthorService} from "../service/author.service";
import {CategoryService} from "../service/category.service";
import {ProductData} from "../model/productData";
import {Author} from "../model/author";
import {LoadingService} from "../service/loading.service";
import {Category} from "../model/category";
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  API = 'http://localhost:8080/catalog/api/v1/image/'

  errorMessage = "";

  product?: Product;
  author?: Author ;
  category?: Category;

  loading$ = this.loader.loading$;

  images: Array<{title: string,  short: string, src: string}> = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private authorService: AuthorService,
              private categoryService: CategoryService,
              public loader: LoadingService,config: NgbCarouselConfig) {

    config.interval = 4000;
    config.keyboard = true;
    config.pauseOnHover = true;

  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if(id){
      this.productService.findById(id).subscribe(data => {
          //console.log(data)

          this.product = data.product;
          console.log("prod",this.product)
          console.log("data",data.product)

          this.getAuthor(data.id_author);
          this.getCategory(data.category);

          if(this.product?.image)   this.images.push( {title: 'First Slide', short: 'First Slide Short', src: this.API + this.product?.image })
          if(this.product?.image2)  this.images.push({title: 'Second Slide', short: 'First Slide Short', src: this.API + this.product?.image2 })
          if(this.product?.image3)  this.images.push({title: 'First Slide', short: 'First Slide Short', src: this.API + this.product?.image3 })


      })
    }
  }

  getAuthor(id: number): void {
    this.authorService.findById(id).subscribe(data => {
      console.log("Author ",data)
      this.author = data;
    })
  }

  getCategory(name: string): void {
    this.categoryService.findByName(name).subscribe(data => {
      console.log("Category ",data)
      this.category = data;
    })
  }



  onBack(): void {
    this.router.navigate(['/catalog']);
  }

}
