import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {LoadingService} from "../service/loading.service";

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;

  loading$ = this.loader.loading$;


  constructor(private userService: UserService,public loader: LoadingService) { }

  ngOnInit(): void {

    this.userService.getUserBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}

