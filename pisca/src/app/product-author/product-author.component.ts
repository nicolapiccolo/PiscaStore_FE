import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../service/product.service";
import {AuthorService} from "../service/author.service";
import {CategoryService} from "../service/category.service";
import {LoadingService} from "../service/loading.service";
import {NgbCarouselConfig, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Product} from "../model/product";
import {AccountService} from "../service/account.service";
import {HttpResponse} from "@angular/common/http";
import {ModalProgress} from "../modal/modalProgress";
import {NgbdModalContent, NgbdModalProgress} from "../product-insert/product-insert.component";
import {ModalConfirm} from "../modal/modalConfirm";
import {ModalError} from "../modal/modalError";
import {ModalSuccess} from "../modal/modalSuccess";

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
              private modalService: NgbModal,
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

  openProgress(message : string){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
    const modalRef = this.modalService.open(NgbdModalProgress,ngbModalOptions);
    modalRef.componentInstance.message = message;
    return modalRef
  }

  closeProgressModal(modalRef: any){
    modalRef.close();
  }


  openError(title: string, name: string, error: string, error_code: string){
    const modalRef = this.modalService.open(ModalError);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.error = error;
    modalRef.componentInstance.error_code = error_code;
  }

  openSuccess(title: string ,message: string){
    const modalRef = this.modalService.open(ModalSuccess);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.message = message;
  }

  deleteProduct(id_product: number){
    console.log(id_product)


    const modalRef = this.modalService.open(ModalConfirm);
    modalRef.componentInstance.title = "Elimina articolo"
    modalRef.componentInstance.name = id_product;
    modalRef.componentInstance.message1 = "Vuoi eliminare l'articolo ";

    modalRef.componentInstance.message2 = "L'articolo non sarà più disponibile all'acquisto sulla nostra piattaforma";

    modalRef.result.then((data) => {
      // on close ok
      console.log("closed")

      const progress  = this.openProgress("Eliminazione in corso")

      this.productService.deleteProduct(id_product).subscribe((data: any) => {
        console.log("deleted: ", data)
        progress.close()
        this.openSuccess("Elimina articolo","Articolo eliminato con successo")
        this.ngOnInit()
        },
      (err:any)=>{
        progress.close()
        this.openError("Elimina articolo",id_product.toString(),"Eliminazione del prodotto non riuscita",err.error.toString())
        console.log(err)
        console.log("cannot delete the product")
      });
    }, (reason) => {
      // on dismiss x close
      console.log("dismiss")
    });
  }

}
