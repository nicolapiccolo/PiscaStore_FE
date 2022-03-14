import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../service/token-storage.service";
import {AuthService} from "../service/auth.service";
import {Address} from "../model/address";
import {AccountService} from "../service/account.service";
import {FormCanDeactivate} from "../form-can-deactivate/form-can-deactivate";
import {NgForm} from "@angular/forms";
import {LoadingService} from "../service/loading.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {ModalError} from "../modal/modalError";
import {ModalSuccess} from "../modal/modalSuccess";
import {NgbdModalProgress} from "../product-insert/product-insert.component";
import {ModalConfirm} from "../modal/modalConfirm";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent extends FormCanDeactivate implements OnInit {
  isEditing = false;
  currentUser: any;
  addressAvailable = false;

  address: any = null;

  name: string = ""
  surname: string = ""
  email: string = ""
  phone: string = ""
  //street: string = ""
  //city: string = ""
  //country: string = ""
  //zipCode: string = ""



  @ViewChild('form')
  form: any;

  loading$ = this.loader.loading$;

  constructor(private accountService: AccountService, private token: TokenStorageService, public loader: LoadingService, private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    console.log("Profile on init")

    this.isEditing = false;
    this.currentUser = this.token.getUser();

    this.accountService.getAddresses().subscribe(
      data => {
        this.addressAvailable = true;

        console.log(data);

        if(data.length>0){
          const ad = data[0];
          var address = new Address(ad.id,ad.street.toString(),ad.city.toString(), ad.country.toString(), ad.zipCode.toString());
          this.address = address
          this.currentUser.address = address.toString();
        }
        //console.log(address.toString());
      },
      err => {
        console.log("Errore: Indirizzo non disponibile")
        //this.currentUser.addresss = JSON.parse(err.error).message;
      }
    );
  }


  showEdit(): void{
    this.isEditing = true;
    console.log(this.isEditing)
    console.log("Name " + this.currentUser.name)

    this.compileForm();

  }

  onSubmit() : void{
    //const { name, email, phone} = this.form;
    const modalRef = this.modalService.open(ModalConfirm);
    modalRef.componentInstance.title = "Conferma modifica"
    modalRef.componentInstance.name = "";
    modalRef.componentInstance.message1 = "Vuoi confermare la modifica al tuo profilo ";
    modalRef.componentInstance.message2 = "Proseguendo le tue informazioni personali verranno aggiornate";

    modalRef.result.then((data) => {
      console.log(this.form.submitted)

      var address : Address = new Address(0,this.street,this.city, this.country, this.zipCode);

      console.log('updating');

      var addresses : Address[] =  [address];

      //var body = this.name

      var formData: any = new FormData();

    /*this.accountService.updateUser(    {name,surname,email,phone}
    ).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    )

    this.authService.register(name, surname, username, email, password, phone, address).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this .errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );*/
      const name = this.name
      const surname = this.surname
      const email = this.email
      const phone = this.phone



      this.accountService.updateUser(    {name,surname,email,phone, addresses}
      ).subscribe(
        data => {
          console.log(data);
          this.openSuccess("Profilo aggiornato","Le informazioni del tuo profilo sono state aggiornate con successo!").result.then(data=>{
            window.location.reload()
          },reason => {
            window.location.reload()
          });
        },
        err => {
          this.openError("Errore aggiornamento","","Non è stato possibile aggiornare le informazioni del tuo profilo","ERR_UPDATE"+err.toString())
          console.log(err);
        }
      )

    }, (reason) => {
      // on dismiss x close
      console.log("dismiss")
    });
  }

  compileForm(): void{

    this.name = this.currentUser.name.toString();
    this.email = this.currentUser.email;
    this.phone = this.currentUser.phone;
    this.surname = this.currentUser.surname;

  }

  openError(title: string, name: string, error: string, error_code: string){
    const modalRef = this.modalService.open(ModalError);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.error = error;
    modalRef.componentInstance.error_code = error_code;
  }

  openSuccess(title: string ,message: string){
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(ModalSuccess,ngbModalOptions);
    modalRef.componentInstance.title = title
    modalRef.componentInstance.message = message;
    return modalRef;
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






}
