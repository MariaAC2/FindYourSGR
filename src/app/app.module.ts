import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MapComponent } from "./pages/map/map.component";
import { AddPoint1Component } from "./pages/add_point1/add_point1.component";
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

import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from "./pages/home/home.component";
import { environment } from "../environments/environment";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddPoint2Component } from './pages/add_point2/add_point2.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    AddPoint1Component,
    AddPoint2Component
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
    FormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase, 'AngularDemoArcGIS'),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
