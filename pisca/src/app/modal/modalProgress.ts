import {Component} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ngbd-modal-progress',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Conferma prodotto</h4>
    </div>
    <div class="modal-body">

      <div class="spinner" >
        <div class="spinner-border" role="status"  >
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <p><strong>{{message}}</strong></p>


    </div>
  `
})
export class ModalProgress {

  message: string = '';

  constructor(public modal: NgbActiveModal) {}
}

