import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryListComponent } from './category-list/category-list.component';
import {CategoryService} from "./service/category.service";

import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { authInterceptorProviders } from './helpers/auth.interceptor';
import { HomeComponent } from './home/home.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import {CanDeactivateGuard} from "./can-deactivate/can-deactivate.guard";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductInsertComponent } from './product-insert/product-insert.component';
import { DndDirective } from './dnd.directive';
import { ProgressComponent } from './progress/progress.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';





@NgModule({
  declarations: [
    AppComponent,
    CategoryListComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardUserComponent,
    HomeComponent,
    ProfileEditComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductInsertComponent,
    DndDirective,
    ProgressComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgbModule
  ],
  providers: [
    authInterceptorProviders,
    CanDeactivateGuard,
    CategoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
