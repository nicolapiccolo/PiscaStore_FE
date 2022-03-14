import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../service/loading.service";
import {AccountService} from "../service/account.service";
import {TokenStorageService} from "../service/token-storage.service";
import {Address} from "../model/address";
import {Product} from "../model/product";
import {ModalAddress} from "../modal/modalAddress";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {ModalSuccess} from "../modal/modalSuccess";
import {ModalConfirm} from "../modal/modalConfirm";
import {NgbdModalProgress} from "../product-insert/product-insert.component";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../service/order.service";
import {Item} from "../model/item";
import {OrderUser} from "../model/orderUser";
import {HttpResponse} from "@angular/common/http";
import {ModalError} from "../modal/modalError";

@Component({
  selector: 'app-checkout-order',
  templateUrl: './checkout-order.component.html',
  styleUrls: ['./checkout-order.component.css']
})
export class CheckoutOrderComponent implements OnInit {
  currentUser: any;
  loading$ = this.loader.loading$;
  addresses: Array<Address> = new Array<Address>();
  products: Array<Product> = new Array<Product>();
  strTotal: string = "";
  currentAddress?: Address;
  totalPrice: number = 0;
  isEmpty = true;

  token: string = '';

  isSuccess = false;

  constructor(public loader: LoadingService,
              private accountService: AccountService,
              private modalService: NgbModal,
              private tokenStorage: TokenStorageService,
              private route: ActivatedRoute,
              private orderService: OrderService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.tokenStorage.getAddress() != undefined) {
      this.currentAddress = this.tokenStorage.getAddress();
    }

    this.accountService.getCurrentUser().subscribe((data: any) => {
        console.log("user: ", data)
        if (data <= 0 || data == undefined || data == null) {
          this.currentUser = 0
          console.log("cannot retrive user")
        } else {

          this.accountService.getAddresses().subscribe((data) => {
            if (data.length > 0) {
              this.isEmpty = false;
            } else {
              this.isEmpty = true;
            }
          });

          this.currentUser = data
          this.products = this.tokenStorage.getProduct()
          if (this.products!!.length > 0) {
            this.isEmpty = false;
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
    this.route.queryParams.subscribe((params: any) => {
        progress1.close()
        console.log(params); // { category: "fiction" }
        if (params.token != null || params.token != undefined) {
          this.token = params.token;
          if (this.token.length > 0) {

            this.orderService.capture(this.token).subscribe((data) => {
              console.log(data)

              if (data == "COMPLETED") {
                this.generateOrder()
              }
            })
          }
        }
      }
    );
  }

  getTotalItems(): string {
    this.strTotal = this.products.length + " item"
    if (this.products.length!! > 1) this.strTotal += "s"
    return this.strTotal
  }

  getTotalPrice() {
    this.totalPrice = 0
    for (let product of this.products) {
      this.totalPrice += Number(product.price)
    }
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

  modifyAddress() {
    let modalRef = this.modalService.open(ModalAddress);
    modalRef.result.then((data) => {
      // on close ok
      console.log("closed")
      if(data === "newAddress") modalRef = this.modalService.open(ModalAddress);
      else this.currentAddress = data;
    }, (reason) => {
      // on dismiss x close
      console.log("dismiss")
    });
  }

  async generateOrder() {

    const progress = this.openProgress("Creazione ordine in corso")

    let items = new Array<Item>();

    for (let product of this.products!!) {
      items.push(new Item(product.name, Number(product.price), product.id))
    }

    const order = new OrderUser(this.currentUser, this.currentAddress!.id, items)


    console.log("ORDER: ", order);
    this.orderService.create(order).subscribe(
      (event: any) => {
        progress.close()
        if (event instanceof HttpResponse) {
          console.log(event.body.message)
          const id = event.body.message

          const success = this.openSuccess("Ordine Completato", "La procedura di pagamento è andata a buon fine, l'ordine è stato salvato!");
          success.result.then((data) => {
            console.log(data)
            this.isSuccess = true;
            this.emptyCart();
          });

          //if(modalRef) this.closeProgressModal(modalRef)

          //this.router.navigateByUrl('catalog/' + id);
        }
      },
      (err: any) => {
        progress.close()
        //if(modalRef) this.closeProgressModal(modalRef)
        this.isSuccess = false;
        if (err.error && err.error.message) {
          console.log(err.error.message);
          //this.errorModal(err.error.message);

        } else {
          console.log('Error during creation')
          //this.errorModal('Generic Error');
        }
      }
    )
  }

  openError(title: string, name: string, error: string, error_code: string) {
    const modalRef = this.modalService.open(ModalError);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.error = error;
    modalRef.componentInstance.error_code = error_code;
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

  emptyCart() {
    this.tokenStorage.removeAddress();
    this.tokenStorage.removeProduct();
    this.isSuccess = true;
    //window.location.reload()
  }

  pay() {
    if (this.currentAddress != null) {

      const modalRef = this.modalService.open(ModalConfirm);
      modalRef.componentInstance.title = "Conferma ordine"
      modalRef.componentInstance.name = "";
      modalRef.componentInstance.message1 = "Vuoi confermare l'ordine ";

      modalRef.componentInstance.message2 = "Andando avanti verrà indirizzato alla pagina di pagamento";

      modalRef.result.then((data) => {
        this.orderService.payment(this.totalPrice).subscribe((event: any) => {
            console.log(event)
            window.open(event, "_self")
          },
          (err: any) => {
            console.log(err)
          })
      }, (reason) => {
        // on dismiss x close
        console.log("dismiss")
      });

    } else this.openError("Indirizzo non selezionato", '', 'Non hai selezionato nessun indirizzo, selezionane uno prima di procedere!', "");

  }

}
