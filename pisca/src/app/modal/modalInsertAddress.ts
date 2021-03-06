import {Component} from "@angular/core";
import {NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Address} from "../model/address";
import {NgbdModalProgress} from "../product-insert/product-insert.component";
import {AccountService} from "../service/account.service";

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Modifica Indirizzo</h4>
      <button type="button" class="btn-close" aria-describedby="modal-title"
              (click)="modal.dismiss('Cross click')"></button>
    </div>
    <form
      #form="ngForm"
      (ngSubmit)="onSubmit()">

      <div class="card-body">


        <div class="row mb-3" >
          <div class="col-sm-3">
            <h6 class="mb-0">Country</h6>
          </div>
          <div class="col-sm-9 text-secondary">
            <input type="text" class="form-control"
                   name="country"
                   [(ngModel)]="country"
            />
          </div>
        </div>


        <div class="row mb-3" >
          <div class="col-sm-3">
            <h6 class="mb-0">Street</h6>
          </div>
          <div class="col-sm-9 text-secondary">
            <input type="text" class="form-control"
                   name="street"
                   [(ngModel)]="street"
            />
          </div>
        </div>

        <div class="row mb-3" >
          <div class="col-sm-3">
            <h6 class="mb-0">City</h6>
          </div>
          <div class="col-sm-9 text-secondary">
            <input type="text" class="form-control"
                   name="city"
                   [(ngModel)]="city"
            />
          </div>
        </div>

        <div class="row mb-3" >
          <div class="col-sm-3">
            <h6 class="mb-0">Zip Code</h6>
          </div>
          <div class="col-sm-9 text-secondary">
            <input type="text" class="form-control"
                   name="zipCode"
                   [(ngModel)]="zipCode" required>

          </div>
        </div>

      </div>
    </form>

    <div class="modal-footer">
      <div class="alert-msg">
        {{errorMsg}}
      </div>
      <button type="button" class="btn btn-danger" (click)="onSubmit()">Salva</button>
    </div>
  `,
  styleUrls: ['./modal.scss']

})
export class ModalInsertAddress {

  country: string = ''
  street: string = '';
  city: string = '';
  zipCode: string = '';
  errorMsg = "";
  constructor(public modal: NgbActiveModal, private modalService: NgbModal) {
  }

  onSubmit(){
    if(this.street!="" && this.city!="" && this.country!="" && this.zipCode!=""){
      this.errorMsg = ""
      let address: Address = new Address(0,this.street, this.city, this.country, this.zipCode)
      this.modal.close(address)
    }
    else this.errorMsg = "Informazioni mancanti"

  }

}
