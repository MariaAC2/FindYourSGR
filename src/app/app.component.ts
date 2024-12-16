import { Component } from '@angular/core';
import { NavigationEnd, Event, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPoint1Component } from "./pages/add/add.component";

interface ITab {
  name: string;
  link: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  tabs: ITab[] = [
    { name: 'Home', link: '/home' },
    { name: 'Map', link: '/map' },
    { name: "AddPoint1", link: '/add' }
  ];

  activeTab = this.tabs[0].link;

  constructor(private router: Router, private dialog: MatDialog) {
    // Actualizează tab-ul activ la fiecare navigare
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.activeTab = event.url;
        console.log(event);
      }
    });
  }

  // Funcție pentru a afișa evenimentul mapLoaded
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  // Deschide pop-up-ul ServicePopupComponent
  openPopup(): void {
    const dialogRef = this.dialog.open(AddPoint1Component, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Serviciu selectat:', result);
      } else {
        console.log('Dialogul a fost închis fără selecție.');
      }
    });
  }
}
