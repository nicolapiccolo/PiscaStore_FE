import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent} from "./category-list/category-list.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ProfileComponent} from "./profile/profile.component";
import {BoardAdminComponent} from "./board-admin/board-admin.component";
import {BoardUserComponent} from "./board-user/board-user.component";
import {HomeComponent} from "./home/home.component";
import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {CanDeactivateGuard} from "./can-deactivate/can-deactivate.guard";
import {ProductListComponent} from "./product-list/product-list.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {ProductInsertComponent} from "./product-insert/product-insert.component";
import {ProductAuthorComponent} from "./product-author/product-author.component";
import {CartComponent} from "./cart/cart.component";
import {PaymentOrderComponent} from "./payment-order/payment-order.component";
import {CheckoutOrderComponent} from "./checkout-order/checkout-order.component";
import {ProfileOrdersComponent} from "./profile-orders/profile-orders.component";
import {ProfileAddressComponent} from "./profile-address/profile-address.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'categories', component:CategoryListComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canDeactivate:[CanDeactivateGuard]},
  { path: 'profile_address', component: ProfileAddressComponent},
  { path: 'user', component: BoardUserComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'profile_edit', component: ProfileEditComponent},
  { path: 'profile_order', component: ProfileOrdersComponent},
  { path: 'catalog', component: ProductListComponent},
  { path: 'catalog/category/1', component: ProductListComponent},
  { path: 'catalog/category/2', component: ProductListComponent},
  { path: 'catalog/category/3', component: ProductListComponent},
  { path: 'catalog/category/4', component: ProductListComponent},
  { path: 'catalog/:id', component:ProductDetailsComponent},
  { path: 'product_insert', component: ProductInsertComponent},
  { path: 'product_author', component: ProductAuthorComponent},
  { path: 'cart', component: CartComponent},
  { path: 'payment', component: PaymentOrderComponent},
  { path: 'checkout', component: CheckoutOrderComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
