import {Component} from "@angular/core";
import {NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Address} from "../model/address";
import {NgbdModalProgress} from "../product-insert/product-insert.component";
import {ModalInsertAddress} from "./modalInsertAddress";
import {AccountService} from "../service/account.service";

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Modifica Indirizzo</h4>
      <button type="button" class="btn-close" aria-describedby="modal-title"
              (click)="modal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p><strong>I tuoi indirizzi<span class="text-primary"></span></strong></p>
      <ng-container *ngFor="let address of addresses">
        <label for="lab_{{address}}">{{address}}</label>
        <input type="radio" name="radioChoice" id="lab_{{address}}"
               [(ngModel)]="this.radioChoice" value="{{address}}"/>
      </ng-container>
      <button class="btn-remove" (click)="addAddress()">+ Aggiungi un nuovo indirizzo</button>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="onSubmit()">Ok</button>
    </div>
  `,
  styleUrls: ['./modal.css']

})
export class ModalAddress {
  radioChoice?: Address;
  name: string = '';
  title: string = ''
  message1: string = '';
  message2: string = '';
  addresses: Array<Address> = new Array<Address>();

  constructor(public modal: NgbActiveModal, private modalService: NgbModal, public accountService: AccountService) {}

  onSubmit(){
    if(this.radioChoice != null){
      this.modal.close(this.radioChoice)
    }
  }

  addAddress(){
    const modalRef = this.modalService.open(ModalInsertAddress);
    modalRef.componentInstance.title = "Elimina articolo"
    modalRef.componentInstance.name = "name";

    modalRef.componentInstance.message1 = "Vuoi eliminare l'articolo ";

    modalRef.componentInstance.message2 = "L'articolo non sarà più disponibile all'acquisto sulla nostra piattaforma";

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

    }, (reason) => {
      // on dismiss x close
      console.log("dismiss")
    });
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

}
