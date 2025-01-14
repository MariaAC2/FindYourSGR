import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

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
    { name: "Adaugă un punct", link: '/add_point' },
    { name: "Favorite", link: '/favorites' },
    { name: "Istoric căutări", link: '/history' },
    { name: "Contul meu", link: '/account' }
  ];

  activeTab = this.tabs[0].link;

  constructor(private router: Router, private dialog: MatDialog) {
    // Subscribe to router events to detect route changes
    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
            this.activeTab = event.url;
            console.log('Active tab: ' + this.activeTab);
        }
    });
  }

  onTabClick(tab: ITab): void {
    this.activeTab = tab.link;
    console.log('Active tab: ' + this.activeTab);
    this.router.navigate([this.activeTab]);
  }

  // Function to handle map loaded event
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  isMainPage(): boolean {
    const mainPages = ['/map', '/add_point', '/favorites', '/history', '/account'];
    return mainPages.includes(this.activeTab);
  }
}
