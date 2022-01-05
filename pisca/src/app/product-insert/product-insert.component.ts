import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../service/category.service";
import {LoadingService} from "../service/loading.service";
import {Category} from "../model/category";


@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.css']
})
export class ProductInsertComponent implements OnInit {

  /*
      "product":{
        "name":"Daylight",
        "description":"Quadro forme geometriche",
        "dimensions":"80x97",
        "price":4567.00,
        "image":"https://i.ibb.co/CwfSFYD/image-4.png",
        "available":true
    },
    "id_author":1,
    "category":"Dipinti"
   */

  categories?: Category[]


  constructor(private categoryService: CategoryService, public loader: LoadingService) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(data => {
      this.categories = data
    })
  }




}
