import {Component, OnInit} from '@angular/core';
import {Product} from "../model/product";
import {CartService} from "../service/cart.service";
import {ProductService} from "../service/product.service";
import {LoadingService} from "../service/loading.service";
import {ActivatedRoute, Router} from "@angular/router";
import {formatNumber} from "@angular/common";

import {TokenStorageService} from "../service/token-storage.service";

import {AccountService} from "../service/account.service";
import {OrderUser} from "../model/orderUser";
import {Item} from "../model/item";
import {HttpResponse} from "@angular/common/http";
import {OrderService} from "../service/order.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {NgbdModalProgress} from "../product-insert/product-insert.component";
import {ModalConfirm} from "../modal/modalConfirm";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  currentUser: number = 0;
  products?: Array<Product>;
  isEmpty = true;
  size = this.products?.length;
  loading$ = this.loader.loading$;
  strTotal = ""
  totalPrice: number = 0


  constructor(public loader: LoadingService,
              private route: ActivatedRoute,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private cartService: CartService,
              private accountService: AccountService,
              private orderService: OrderService,
              private modalService: NgbModal) {

  }


  ngOnInit(): void {
    this.accountService.getCurrentUser().subscribe((data: any) => {
        console.log("user: ", data)
        if (data <= 0 || data == undefined || data == null) {
          this.currentUser = 0
          console.log("cannot retrive user")
        } else {
          this.currentUser = data
          this.products = this.tokenStorage.getProduct()
          if (this.products!!.length > 0) {
            this.isEmpty = false;
            this.size = this.products?.length;
            this.getTotalItems();
            this.getTotalPrice();
          }
          console.log(this.isEmpty)
        }
      },
      (err: any) => {
        console.log(err)
        this.currentUser = 0
        console.log("cannot retrive user")
        this.router.navigateByUrl("/login")
      });
  }

  openProgress(message: string) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(NgbdModalProgress, ngbModalOptions);
    modalRef.componentInstance.message = message;
    return modalRef

  }

  closeProgressModal(modalRef: any) {
    modalRef.close();
  }


  getTotalItems(): string {
    this.strTotal = this.size + " item"
    if (this.size!! > 1) this.strTotal += "s"
    return this.strTotal
  }


  getTotalPrice() {
    this.totalPrice = 0
    for (let product of this.products!!) {
      this.totalPrice += Number(product.price)
    }
  }

  removeItem(product: Product) {
    console.log("ON REMOVE:",product)
    this.cartService.setProducts(product)
    window.location.reload()
  }

  async createOrder() {

    if (this.currentUser > 0) {

      if (this.products != undefined && this.products.length > 0) {

        const modalRef = this.modalService.open(ModalConfirm);
        modalRef.componentInstance.title = "Conferma ordine"
        modalRef.componentInstance.name = "";
        modalRef.componentInstance.message1 = "Vuoi confermare l'ordine ";

        modalRef.componentInstance.message2 = "L'articolo non sarà più disponibile all'acquisto sulla nostra piattaforma";

        modalRef.result.then((data) => {

          const progress = this.openProgress("Creazione ordine in corso")

          let items = new Array<Item>();

          for (let product of this.products!!) {
            items.push(new Item(product.name, Number(product.price), product.id))
          }

          const order = new OrderUser(this.currentUser, items)


          console.log("ORDER: ", order);
          this.orderService.create(order).subscribe(
            (event: any) => {
              progress.close()
              if (event instanceof HttpResponse) {
                console.log(event.body.message)
                const id = event.body.message

                //if(modalRef) this.closeProgressModal(modalRef)

                //this.router.navigateByUrl('catalog/' + id);
              }
            },
            (err: any) => {
              progress.close()
              //if(modalRef) this.closeProgressModal(modalRef)
              if (err.error && err.error.message) {
                console.log(err.error.message);
                //this.errorModal(err.error.message);

              } else {
                console.log('Error during creation')
                //this.errorModal('Generic Error');
              }
            }
          )

        }, (reason) => {
          // on dismiss x close
          console.log("dismiss")
        });

      }

    } else console.log("Invalid user")


  }

}

