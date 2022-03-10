import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from "../model/product";
import {Address} from "../model/address";
import {LoadingService} from "../service/loading.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenStorageService} from "../service/token-storage.service";
import {OrderService} from "../service/order.service";
import {AccountService} from "../service/account.service";
import {ModalConfirm} from "../modal/modalConfirm";
import {Item} from "../model/item";
import {OrderUser} from "../model/orderUser";
import {HttpResponse} from "@angular/common/http";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {NgbdModalProgress} from "../product-insert/product-insert.component";
import {ModalError} from "../modal/modalError";
import {ModalSuccess} from "../modal/modalSuccess";
import {ICreateOrderRequest, IPayPalConfig} from "ngx-paypal";



@Component({
  selector: 'app-payment-order',
  templateUrl: './payment-order.component.html',
  styleUrls: ['./payment-order.component.css']
})
export class PaymentOrderComponent implements OnInit {

  products: Array<Product> = new Array<Product>();
  address?: Address;


  currentUser: number = 0;
  selectedAddress: number = 0;

  isEmpty = true;
  size = this.products?.length;
  loading$ = this.loader.loading$;
  strTotal = ""
  totalPrice: number = 0

  public payPalConfig?: IPayPalConfig;



  constructor(public loader: LoadingService,
              private route: ActivatedRoute,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private orderService: OrderService,
              private accountService: AccountService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.accountService.getCurrentUser().subscribe((data: any) => {
        console.log("user: ", data)
        if (data <= 0 || data == undefined || data == null) {
          this.currentUser = 0
          console.log("cannot retrive user")
        } else {
          this.currentUser = data

          const address = this.orderService.getAddress()
          if(address!=null){
            this.address = address
            this.products = this.tokenStorage.getProduct()
            if (this.products!!.length > 0) {
              this.isEmpty = false;
              this.size = this.products?.length;
            } else this.openError('Errore prodotti','','Impossibile ritrovare i prodotto nel carrello','ERR_PRODUCTS_NOT AVAILABLE')
          } else this.openError('Errore indirizzo','','Impossibile ritrovare indirizzo di spedizione','ERR_ADDRESS_NOT AVAILABLE')

        }
      },
      (err: any) => {
        console.log(err)
        this.currentUser = 0
        console.log("cannot retrive user")
        this.router.navigateByUrl("/login")
      });

    this.initConfig()
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'Acqxu0m8Bwat3CmZuVupcvPSI3VaVJQgq7pcppr0iGMFBkf4RyXLUIZdFQ4ZG7J1flxwak-Bwu0R_4sO',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details:any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        //this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
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
    const modalRef = this.modalService.open(ModalSuccess);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.message = message;
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

  confirmAndPay(){

  }

  createOrder(data: any, actions:any) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '0.01'
        }
      }]
    });
  }

  onApprove(data: any, actions: any) {
    return actions.order.capture();
  }


  create(){
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

          const order = new OrderUser(this.currentUser, this.selectedAddress, items)


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
