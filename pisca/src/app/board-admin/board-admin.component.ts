import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {LoadingService} from "../service/loading.service";

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})

export class BoardAdminComponent implements OnInit {
  content?: string;

  loading$ = this.loader.loading$;


  constructor(private userService: UserService,public loader: LoadingService) { }

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}
