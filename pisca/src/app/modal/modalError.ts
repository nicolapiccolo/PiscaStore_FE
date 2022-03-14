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
      <span class="text-danger">{{error}}<span
        class="text-primary">{{name}}</span></span>
      <p><strong>{{error_code}}</strong></p>

    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
    </div>
  `,
  styleUrls: ['./modal.scss']
})
export class ModalError {

  title: string = '';
  error: string = '';
  error_code: string = '';
  name: string = '';

  constructor(public modal: NgbActiveModal) {
  }
}
