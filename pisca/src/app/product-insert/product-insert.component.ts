import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../service/category.service";
import {LoadingService} from "../service/loading.service";
import {Category} from "../model/category";
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {ImageService} from "../service/image.service";
import {HttpClient, HttpEventType, HttpResponse} from "@angular/common/http";
import { Observable } from 'rxjs';
import {Product} from "../model/product";
import {ProductData} from "../model/productData";
import {ProductService} from "../service/product.service";
import {AccountService} from "../service/account.service";



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

  currentUser: number = 0

  form: any = {
    name: null,
    description: null,
    dimension: null,
    price: null,
  };


  categories?: Category[];
  selectedCategory: string = '';

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';


  isSuccessful = false;
  isFailed = false;
  errorMessage = '';

  loading$ = this.loader.loading$;


  images : string[] = [];

  image : string = "";

  constructor(private categoryService: CategoryService,
              public loader: LoadingService,
              private imageService: ImageService,
              private http: HttpClient,
              private productService: ProductService,
              private accountService: AccountService) { }

  updateCategory(e : any){
    this.selectedCategory = e.target.value.toString()
  }

  ngOnInit(): void {
    this.accountService.getCurrentUser().subscribe(data=>{
      console.log("user: ",data)
      this.currentUser = data
    })

    this.categoryService.findAll().subscribe(data => {
      this.categories = data
    })
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.imageService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = "Upload file with success!";
              this.image = event.body.message;
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          });
      }
      this.selectedFiles = undefined;
    }
  }

  createProduct(){

    if(this.currentUser > 0 ){
      const product: Product = new Product(0, this.form.name, this.form.description, this.form.dimensions, this.form.price, true ,this.image)

      const pData: ProductData = new ProductData(product,this.currentUser, this.selectedCategory)



      this.productService.createProduct(pData).subscribe(
        (event: any) =>{
          if( event instanceof HttpResponse){
            this.isSuccessful = true
            console.log(event.body.message)
          }
        },
        (err: any) =>{
          if (err.error && err.error.message) {
            console.log(err.error.message);
          } else {
            console.log('Error during creation');
          }
        }
      )
    }
    else console.log("Invalid current user")

  }

}
