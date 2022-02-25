import { Component, OnInit } from '@angular/core';
import {AuthService} from "../service/auth.service";
import {Address} from "../model/address";
import {Router} from "@angular/router";
import {LoadingService} from "../service/loading.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  form: any = {
    name: null,
    surname: null,
    username: null,
    email: null,
    password: null,
    phone:null,
    street: null,
    city: null,
    country: null,
    zipCode: null
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  loading$ = this.loader.loading$;


  constructor(private authService: AuthService, public loader: LoadingService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { name, surname, username, email, password, phone, street, city, country, zipCode } = this.form;

    var address : Address = new Address(this.form.street,this.form.city, this.form.country, this.form.zipCode);

    console.log('registering');

    this.authService.register(name, surname, username, email, password, phone, address).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        //this.router.navigateByUrl()
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  refresh(path: string): void{
    if (window.location.pathname.toString() == path){
      window.location.reload()
    }
  }
}
