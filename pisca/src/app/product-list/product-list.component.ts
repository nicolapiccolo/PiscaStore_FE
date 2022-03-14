import { Component, OnInit } from '@angular/core';
import {Product} from "../model/product";
import {ProductService} from "../service/product.service";
import {LoadingService} from "../service/loading.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products?: Product[];

  loading$ = this.loader.loading$;

  isEmpty = false;

  category : string = ''

  categories: Array<string> = ['Vasi','Dipinti','Altro','Artigianato']

  constructor(private productListService: ProductService,
              public loader: LoadingService,
              private route: ActivatedRoute,
              private router: Router,) {
    console.log("created")
  }

  ngOnInit() {
    if(this.route.snapshot.url.length>2){
      const id = Number(this.route.snapshot.url[2].toString())

      console.log("ID:",id)
      if(id>0){
        this.category=this.categories[id-1];
        this.productListService.findByCategory(id).subscribe(data => {
          if(data.length>0){
            this.products = data
          }
          else this.isEmpty=true
        });
      }
    }
    else{
      this.category = 'Tutti i prodotti'
      this.productListService.findAll().subscribe(data => {
        if(data.length>0){
          this.products = data
        }
        else this.isEmpty=true
      });
    }
  }

  openDetails(id: number){
    console.log(id);
  }

  refresh(): void {
    window.location.reload();
  }

}
