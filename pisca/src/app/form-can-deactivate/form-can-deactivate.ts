import {NgForm} from "@angular/forms";
import {ComponentCanDeactivate} from "../can-deactivate/component-can-deactivate";

export abstract class FormCanDeactivate extends ComponentCanDeactivate{

  abstract get form():NgForm;

  canDeactivate():boolean{
    console.log("CAN DEC")
    console.log("form: " + this.form)
    if(this.form === undefined)
      return true
    else
      return this.form.submitted || !this.form.dirty
  }
}
