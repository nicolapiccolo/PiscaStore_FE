import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../service/token-storage.service";
import {AuthService} from "../service/auth.service";
import {Address} from "../model/address";
import {AccountService} from "../service/account.service";
import {FormCanDeactivate} from "../form-can-deactivate/form-can-deactivate";
import {NgForm} from "@angular/forms";
import {LoadingService} from "../service/loading.service";

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
  street: string = ""
  city: string = ""
  country: string = ""
  zipCode: string = ""



  @ViewChild('form')
  form: any;

  loading$ = this.loader.loading$;

  constructor(private accountService: AccountService, private token: TokenStorageService, public loader: LoadingService) {
    super();
  }

  ngOnInit(): void {
    console.log("Profile on init")

    this.isEditing = false;
    this.currentUser = this.token.getUser();

    this.accountService.getAddresses().subscribe(
      data => {
        this.addressAvailable = true;
        var address = new Address(0,data.street.toString(),data.city.toString(), data.country.toString(), data.zipCode.toString());
        this.address = address
        this.currentUser.address = address.toString();

        console.log(address.toString());
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
    console.log(this.form.submitted)

    var address : Address = new Address(0,this.street,this.city, this.country, this.zipCode);

    console.log('updating');

    var addresses : Address[] =  [address];

    //var body = this.name

    var formData: any = new FormData();

    const name = this.name
    const surname = this.surname
    const email = this.email
    const phone = this.phone



    this.accountService.updateUser(    {name,surname,email,phone, addresses}
    ).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    )

    /*this.authService.register(name, surname, username, email, password, phone, address).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );*/
  }

  compileForm(): void{

    this.name = this.currentUser.name.toString();
    this.email = this.currentUser.email;
    this.phone = this.currentUser.phone;
    this.surname = this.currentUser.surname;

    if(this.address !== null){

      this.street = this.address.street;
      this.zipCode = this.address.zipCode;
      this.city = this.address.city;
      this.country = this.address.country;

    }

  }






}
