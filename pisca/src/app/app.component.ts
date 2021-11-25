import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "./service/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  title = 'pisca'
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');

      this.username = user.username;
    }
  }

  refresh(path: string): void{
    if (window.location.pathname.toString() == path){
      window.location.reload()
    }
    console.log(window.location.pathname.toString())
    console.log("/profile")
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
