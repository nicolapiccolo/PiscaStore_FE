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

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  errorMessage = "";

  product?: Product;
  author?: Author ;
  category?: Category;

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
          //console.log(data)

          this.product = data.product;
          this.getAuthor(data.id_author);
          this.getCategory(data.category);
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
