import { Component, OnInit } from '@angular/core';
import {AccountService} from "../service/account.service";
import {TokenStorageService} from "../service/token-storage.service";
import {Address} from "../model/address";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  currentUser: any;
  addressAvailable = false;

  constructor(private accountService: AccountService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.accountService.getAddresses().subscribe(
      data => {
        this.addressAvailable = true;
        var address = new Address(0,data.street.toString(),data.city.toString(), data.country.toString(), data.zipCode.toString());
        this.currentUser.address = address.toString();
        console.log(address.toString());
      },
      err => {
        //this.currentUser.addresss = JSON.parse(err.error).message;
      }
    );
  }

}
