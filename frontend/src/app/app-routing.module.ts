import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MapComponent } from './pages/map/map.component';
import { HomeComponent } from './pages/home/home.component';
import { AddPoint1Component } from "./pages/add_point1/add_point1.component";
import { AddPoint2Component } from "./pages/add_point2/add_point2.component";
import { AccountComponent } from './pages/account/account.component';
import { AuthenticationComponent } from "./pages/authentication/authentication.component";
import { LoginComponent } from "./pages/login/login.component";
import {ScannerDialogComponent} from "./pages/scanner-dialog/scanner-dialog.component";
import { AuthGuard } from './guards/auth.guard';
 
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'map',
    component: MapComponent,
    children: [
      { path: 'add_point', component: MapComponent },
    ],
  },
  {
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'authenticate', 
    component: AuthenticationComponent
  },
  { path: 'account', 
    component: AccountComponent,
    canActivate: [AuthGuard]
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
