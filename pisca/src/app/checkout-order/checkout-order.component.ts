import { Component, OnInit } from '@angular/core';
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
  strTotal:string = "";
  currentAddress: Address = new Address("","","","");
  totalPrice: number = 0;
  isEmpty = true;

  constructor(public loader: LoadingService, private accountService: AccountService, private modalService: NgbModal, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.accountService.getAddresses().subscribe(
      data => {
        for(let a in data){
          this.isEmpty = false;
          var address = new Address(data[a].street.toString(),data[a].city.toString(), data[a].country.toString(), data[a].zipCode.toString());
          this.addresses.push(address)
        }
      },
      err => {
        this.currentUser.addresss = JSON.parse(err.error).message;
      }
    );
    if(this.currentAddress.street.toString() === "") this.currentAddress = this.addresses[0];
    this.products = this.tokenStorage.getProduct();
    this.getTotalPrice()
    this.getTotalItems()
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

  modifyAddress(){
    const modalRef = this.modalService.open(ModalAddress);
    modalRef.componentInstance.title = "Elimina articolo"
    modalRef.componentInstance.name = "name";
    modalRef.componentInstance.addresses = this.addresses;
    modalRef.componentInstance.message1 = "Vuoi eliminare l'articolo ";

    modalRef.componentInstance.message2 = "L'articolo non sarà più disponibile all'acquisto sulla nostra piattaforma";

    modalRef.result.then((data) => {
      // on close ok
      console.log("closed")
      this.currentAddress = data;
    }, (reason) => {
      // on dismiss x close
      console.log("dismiss")
    });
  }

}
