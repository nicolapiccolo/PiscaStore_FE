import { Component, OnInit } from '@angular/core';
import {AuthService} from "../service/auth.service";
import {Address} from "../model/address";

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

  constructor(private authService: AuthService) { }

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
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
