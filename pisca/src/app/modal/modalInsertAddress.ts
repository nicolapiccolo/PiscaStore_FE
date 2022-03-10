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
            <div class="invalid-feedback">
              Please choose a username.
            </div>
          </div>
        </div>

      </div>
    </form>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="onSubmit()">Salva</button>
    </div>
  `,
  styleUrls: ['./modal.css']

})
export class ModalInsertAddress {

  country: string = ''
  street: string = '';
  city: string = '';
  zipCode: string = '';
  constructor(public modal: NgbActiveModal, private modalService: NgbModal) {
  }

  onSubmit(){
    if(this.street!="" && this.city!="" && this.country!="" && this.zipCode!=""){
      let address: Address = new Address(this.street, this.city, this.country, this.zipCode)
      this.modal.close(address)
    }

  }

}
