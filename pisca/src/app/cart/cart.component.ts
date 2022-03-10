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
import {Address} from "../model/address";
import {ICreateOrderRequest, IPayPalConfig} from "ngx-paypal";
import {ModalError} from "../modal/modalError";
import {ModalSuccess} from "../modal/modalSuccess";


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
  totalPrice: number = 0;

  showSuccess = false;

  token: string = '';

  public payPalConfig: IPayPalConfig = {
    currency: 'EUR',
    clientId: 'Acqxu0m8Bwat3CmZuVupcvPSI3VaVJQgq7pcppr0iGMFBkf4RyXLUIZdFQ4ZG7J1flxwak-Bwu0R_4sO',
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    createOrderOnClient: (data) => < ICreateOrderRequest > {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: '0',
        }
      }]
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
      this.createOrder()
    }
  };

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

    const progress1 = this.openProgress("Caricamento risultato pagamento")
    this.route.queryParams.subscribe((params:any) => {
          progress1.close()
          console.log(params); // { category: "fiction" }
          if(params.token != null || params.token != undefined){
            this.token = params.token;
            if(this.token.length>0){

              this.orderService.capture(this.token).subscribe((data)=>{
                console.log(data)

                if(data == "COMPLETED"){
                  this.generateOrder()
                }
              })
            }
          }
        }
      );

  }

  emptyCart(){
    this.products = new Array<Product>();
    this.tokenStorage.saveProduct(this.products)
    window.location.reload()
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
    console.log("ON REMOVE:", product)
    this.cartService.setProducts(product)
    window.location.reload()
  }

  createOrder() {
    if (this.currentUser > 0) {
      if (this.products != undefined && this.products.length > 0) {
        //this.orderService.setAddress(new Address('Viale Orazio 44','Andria (BT)', 'Italy','76123'))
        //this.router.navigateByUrl('payment')

        if (this.payPalConfig != undefined) {

          console.log("Creating...")

          this.payPalConfig.createOrderOnClient = (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                currency_code: 'EUR',
                value: String(this.totalPrice),
              }
            }]
          };

          this.payPalConfig.onApprove = (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details: any) => {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
          };

          this.payPalConfig.onClientAuthorization = (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.showSuccess = true;
            this.openSuccess("Pagamento avvenuto","La procedura di pagamento è avvenuta con successo, grazie per l'acquisto!")
          };

          this.payPalConfig.onCancel = (data, actions) => {
            console.log('OnCancel', data, actions);
            this.openError("Pagamento Annullato","","Hai annullato la procedura di pagamento, riprova","ERR_PAYMENT_BLOCKED")
          };

          this.payPalConfig.onError = err => {
            console.log('OnError', err);
            this.openError("Errore Pagamento","","La procedura di pagamento non è stata completata con successo, riprova",err.toString())
          };

        } else console.log("no products added")
      } else console.log("Invalid user")

    }
  }

  openError(title: string, name: string, error: string, error_code: string){
    const modalRef = this.modalService.open(ModalError);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.error = error;
    modalRef.componentInstance.error_code = error_code;
  }

  openSuccess(title: string ,message: string){
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(ModalSuccess,ngbModalOptions);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.message = message;
    return modalRef;
  }


  async generateOrder(){

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

      const order = new OrderUser(this.currentUser, 1, items)


      console.log("ORDER: ", order);
      this.orderService.create(order).subscribe(
        (event: any) => {
          progress.close()
          if (event instanceof HttpResponse) {
            console.log(event.body.message)
            const id = event.body.message

            const success = this.openSuccess("Ordine Completato","La procedura di pagamento è andata a buon fine, l'ordine è stato salvato!");
            success.result.then((data) => {
              console.log(data)
              this.emptyCart();
            });

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

  pay(){
    this.orderService.payment(this.totalPrice).subscribe((event: any) => {
       console.log(event)
        window.open(event,"_self")
      },
      (err: any) => {
       console.log(err)
      })
  }

}

