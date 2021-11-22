import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../service/token-storage.service";
import {AuthService} from "../service/auth.service";
import {Address} from "../model/address";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  currentUser: any;
  addressAvailable = false;

  constructor(private authService: AuthService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.authService.getAddresses().subscribe(
      data => {
        this.addressAvailable = true;
        var address = new Address(data.street.toString(),data.city.toString(), data.country.toString(), data.zipCode.toString());
        this.currentUser.address = address.toString();
        console.log(address.toString());
      },
      err => {
        //this.currentUser.addresss = JSON.parse(err.error).message;
      }
    );
  }

}
