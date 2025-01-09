import { Component } from '@angular/core';
import { NavigationEnd, Event, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPoint1Component } from "./pages/add_point1/add_point1.component";
import { AddPoint2Component } from "./pages/add_point2/add_point2.component";

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
    { name: 'Acasă', link: '/home' },
    { name: 'Hartă', link: '/map' },
    { name: "Adaugă un punct", link: '/add_point1' },
    { name: "Favorite", link: '/favorites' },
    { name: "Istoric căutări", link: '/history' },
    { name: "Contul meu", link: '/account' }
  ];

  activeTab = this.tabs[0].link;
  isPopupOpen = false;
  showNavbar: boolean = false; // Controls whether the navbar is displayed

  constructor(private router: Router, private dialog: MatDialog) {
    // Subscribe to router events to detect route changes
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.activeTab = event.url;
        // Display navbar only on the '/map' route
        this.showNavbar = event.url === '/map';
      }
    });
  }

  onTabClick(tab: ITab): void {
    this.activeTab = tab.link;

    if (tab.name === 'Adaugă un punct') {
      this.openPopup(AddPoint1Component); // Open the dialog for AddPoint1
    } else if (tab.name === "Contul meu") {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate([tab.link]); // Navigate to other pages
    }
  }

  // Function to handle map loaded event
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  openPopup(component: any): void {
    this.isPopupOpen = true;
    const dialogRef = this.dialog.open(component);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'openNext') {
        this.openPopup(AddPoint2Component);
      }
    });
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }
}
