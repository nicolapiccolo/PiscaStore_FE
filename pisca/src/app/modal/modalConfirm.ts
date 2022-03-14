import {Component} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">{{title}}</h4>
      <button type="button" class="btn-close" aria-describedby="modal-title"
              (click)="modal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p><strong>{{message1}}<span class="text-primary">{{name}}</span>?</strong></p>
      <p>{{message2}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancella</button>
      <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
    </div>
  `,
  styleUrls: ['./modal.scss']

})
export class ModalConfirm {

  name: string = '';
  title: string = ''
  message1: string = '';
  message2: string = '';

  constructor(public modal: NgbActiveModal) {}
}
