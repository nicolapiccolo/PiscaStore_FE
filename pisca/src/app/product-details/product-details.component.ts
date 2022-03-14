import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Product} from "../model/product";
import {ProductService} from "../service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthorService} from "../service/author.service";
import {CategoryService} from "../service/category.service";
import {ProductData} from "../model/productData";
import {Author} from "../model/author";
import {LoadingService} from "../service/loading.service";
import {Category} from "../model/category";
import {NgbCarouselConfig, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {CartService} from "../service/cart.service";
import {ModalSuccess} from "../modal/modalSuccess";
import {ModalError} from "../modal/modalError";
import {AccountService} from "../service/account.service";
import {TokenStorageService} from "../service/token-storage.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  @Output() bagEvent = new EventEmitter<number>()
  API = 'http://localhost:8080/catalog/api/v1/image/'
  image_not_available = this.API + "not.png"

  errorMessage = "";

  product?: Product;
  author?: Author;
  category?: Category;

  loading$ = this.loader.loading$;

  images: Array<{ title: string, short: string, src: string }> = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              private authorService: AuthorService,
              private categoryService: CategoryService,
              private cartService: CartService,
              private modalService: NgbModal,
              private accountService: AccountService,
              private tokenStorage: TokenStorageService,
              public loader: LoadingService, config: NgbCarouselConfig) {

    config.interval = 4000;
    config.keyboard = true;
    config.pauseOnHover = true;

  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id) {
      this.productService.findById(id).subscribe(data => {
        //console.log(data)

        this.product = data.product;
        console.log("prod", this.product)
        console.log("data", data.product)

        this.getAuthor(data.id_author);
        this.getCategory(data.category);


        if (this.product?.image) {
          this.images.push({title: '', short: '', src: this.API + this.product?.image})
          if (this.product?.image2) this.images.push({title: '', short: '', src: this.API + this.product?.image2})
          if (this.product?.image3) this.images.push({title: '', short: '', src: this.API + this.product?.image3})
          if (this.product?.image4) this.images.push({title: '', short: '', src: this.API + this.product?.image4})
        } else this.images.push({title: '', short: '', src: this.image_not_available})
      })
    }
  }

  getAuthor(id: number): void {
    this.authorService.findById(id).subscribe(data => {
      console.log("Author ", data)
      this.author = data;
    })
  }

  getCategory(name: string): void {
    this.categoryService.findByName(name).subscribe(data => {
      console.log("Category ", data)
      this.category = data;
    })
  }

  async getCurrentUser(): Promise<boolean> {
    let isLogged = false;
    await this.accountService.getCurrentUser().subscribe((data: any) => {
        console.log("user: ", data)
        if (data <= 0 || data == undefined || data == null) {
          isLogged = false
          console.log("cannot retrive user")
        } else {
          isLogged = true
        }
      },
      (err: any) => {
        console.log(err)
        isLogged = false
        console.log("cannot retrive user")
        //this.router.navigateByUrl("/login")
      });
    return isLogged
  }


   addToCart() {
    if (this.product != null) {

      if (this.tokenStorage.isValid()) {
        if (this.cartService.addToCart(this.product)) {
          const success = this.openSuccess("Aggiunto", "Articolo aggiunto al carrello")
          success.result.then((data) => {
              window.location.reload()
          });
          this.bagEvent.emit(this.cartService.getSize())
        } else this.openError("Errore", "", "L' articolo è già presente nel carrello", "")

      }

      else this.openError("Non sei loggato", "", "Per aggiungere un oggetto al carrello dei prima effettuare il login", "")

    }
  }


  openSuccess(title: string, message: string) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(ModalSuccess, ngbModalOptions);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.message = message;
    return modalRef;
  }

  openError(title: string, name: string, error: string, error_code: string) {
    const modalRef = this.modalService.open(ModalError);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.error = error;
    modalRef.componentInstance.error_code = error_code;
  }

  onBack(): void {
    this.router.navigate(['/catalog']);
  }

}
