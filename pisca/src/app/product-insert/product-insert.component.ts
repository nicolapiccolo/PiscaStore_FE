import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../service/category.service";
import {LoadingService} from "../service/loading.service";
import {Category} from "../model/category";
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {ImageService} from "../service/image.service";
import {HttpClient, HttpEventType, HttpResponse} from "@angular/common/http";
import { Observable } from 'rxjs';



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

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;



  images : string[] = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });


  constructor(private categoryService: CategoryService, public loader: LoadingService, private imageService: ImageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(data => {
      this.categories = data
    })
  }

  get f(){
    return this.myForm.controls;
  }

  /*onFileChange(event:any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event:any) => {
          console.log(event.target.result);
          this.images.push(event.target.result);

          this.myForm.patchValue({
            fileSource: this.images
          });
        }

        this.selectedFiles = event.target.files;
        reader.readAsDataURL(event.target.files[i]);
      }
      this.selectedFile = event.target.files[0]

    }
  }*/

  onFileChange(event: any) {
    this.selectedFiles = event.target.files;
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  upload() {

    this.progress = 0;
    this.currentFile = this.selectedFiles?.item(0)!;

    this.imageService.upload(this.currentFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          //this.fileInfos = this.uploadService.getFiles();
          console.log(this.message)
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
        console.log(this.message)
      });
    this.selectedFiles = undefined;
  }

}
