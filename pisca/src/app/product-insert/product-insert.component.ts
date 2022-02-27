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
  styleUrls: ['./product-insert.component.scss']
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

  uploadedImage: string[] = [];

  constructor(private categoryService: CategoryService,
              public loader: LoadingService,
              private imageService: ImageService,
              private http: HttpClient,
              private productService: ProductService,
              private accountService: AccountService) { }


  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item.fname = ''; //name after upload
      this.files.push(item);
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    const file: string = this.files[index].fname

    if(file.length>0){
      this.imageService.deleteImage(this.files[index].fname).subscribe((event: any) => {
            console.log(event);
            this.message = ("Image deleted!")
            this.files.splice(index, 1);
        },
        (err: any) => {
          console.log(err);
          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not delete the file!';
          }
        });
    }
    else
      this.files.splice(index, 1);
  }


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

  uploadFile(file: any){
    this.imageService.upload(file).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          file.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log("Upload file with success!");
          this.message = "File uploaded"
          file.fname = event.body.message
          this.uploadedImage.push(file.fname);
          console.log(file.fname)
        }
      },
      (err: any) => {
        console.log(err);
        file.progress = 0;
        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not upload the file!';
        }
      });
  }

  uploadAll(){
    console.log("files to upload", this.files)
    this.files.forEach( (file) => {
      console.log(file)
      this.uploadFile(file)
    });

    /*if(this.files[0] != undefined){
      this.uploadFile(this.files[0])
    }*/
  }


  createProduct(){

    if(this.currentUser > 0 ){


      if(this.uploadedImage.length>0) {

        const product: Product = new Product(0, this.form.name, this.form.description,
          this.form.dimensions,
          this.form.price,
          true,
          this.uploadedImage[0] != null ? this.uploadedImage[0] : '',
          this.uploadedImage[1] != null ? this.uploadedImage[1] : '',
          this.uploadedImage[2] != null ? this.uploadedImage[2] : '',
          this.uploadedImage[3] != null ? this.uploadedImage[3] : '',)

        const pData: ProductData = new ProductData(product, this.currentUser, this.selectedCategory)


        this.productService.createProduct(pData).subscribe(
          (event: any) => {
            if (event instanceof HttpResponse) {
              this.isSuccessful = true
              console.log(event.body.message)
            }
          },
          (err: any) => {
            if (err.error && err.error.message) {
              console.log(err.error.message);
            } else {
              console.log('Error during creation');
            }
          }
        )
      }
      else console.log("no image added")
    }
    else console.log("Invalid current user")

  }

}
