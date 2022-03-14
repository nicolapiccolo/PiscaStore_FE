import { Component, OnInit } from '@angular/core';
import {LoadingService} from "../service/loading.service";
import {AccountService} from "../service/account.service";
import {Address} from "../model/address";
import {ModalInsertAddress} from "../modal/modalInsertAddress";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalConfirm} from "../modal/modalConfirm";

@Component({
  selector: 'app-profile-address',
  templateUrl: './profile-address.component.html',
  styleUrls: ['./profile-address.component.css']
})
export class ProfileAddressComponent implements OnInit {
  loading$ = this.loader.loading$;
  addresses: Array<Address> = new Array<Address>();
  isEmpty = true

  constructor(private modalService: NgbModal, public loader: LoadingService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getAddresses().subscribe((data)=>{
      for(let i of data){
        this.addresses.push(new Address(i.id,i.street, i.city, i.country, i.zipCode));
      }
      console.log("IND:",this.addresses);
    })
    if(this.addresses != null) this.isEmpty = false;
  }

  addAddress(){

    const modalRef = this.modalService.open(ModalInsertAddress);
    modalRef.result.then((data) => {
      // on close ok
      console.log("closed")

      this.accountService.setAddress(data).subscribe(
        d => {
          console.log(d);
        },
        err => {
          console.log(err);
        }
      )
      window.location.reload()
    }, (reason) => {
      // on dismiss x close
      console.log("dismiss")
    });
  }

  removeAddress(address: Address){
    const modalRef = this.modalService.open(ModalConfirm);
    modalRef.componentInstance.title = "Elimina indirizzo"
    modalRef.componentInstance.name = address.street;

    modalRef.componentInstance.message1 = "Vuoi eliminare l'indirizzo ";
    modalRef.result.then((data) => {
      // on close ok
      this.accountService.deleteAddress(address.id).subscribe(
        d => {
          console.log(d);
        },
        err => {
          console.log(err);
        }
      )
      window.location.reload()
    }, (reason) => {
      // on dismiss x close
      console.log("dismiss")
    });

  }



}
