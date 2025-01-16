import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { MapComponent } from "./pages/map/map.component";
import { AddPoint1Component } from "./pages/add_point1/add_point1.component";
import { AddPoint2Component } from './pages/add_point2/add_point2.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthenticationComponent } from "./pages/authentication/authentication.component";

import { AppRoutingModule } from "./app-routing.module";

import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from "../environments/environment";

import { FirebaseService } from './services/firebase';
import { SuperheroFactoryService } from "./services/superhero-factory";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './pages/account/account.component';
import { AddPointComponent } from './pages/add-point/add-point.component';
import { ScannerDialogComponent } from './pages/scanner-dialog/scanner-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    AddPoint1Component,
    AddPoint2Component,
    LoginComponent,
    AuthenticationComponent,
    AccountComponent,
    AddPointComponent,
    ScannerDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Necesită Angular Material
    AppRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule, // Adăugat pentru mat-form-field
    MatSelectModule,    // Adăugat pentru mat-select
    MatInputModule,     // Adăugat pentru mat-input
    MatIconModule,      // Adăugat pentru icoane
    MatDialogModule,    // Adăugat pentru dialoguri
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    AngularFireModule.initializeApp(environment.firebase, 'AngularDemoArcGIS'),
    AngularFireDatabaseModule
  ],
  providers: [FirebaseService, SuperheroFactoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
