import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, Event } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPoint1Component } from './pages/add_point1/add_point1.component';
import { AddPoint2Component } from './pages/add_point2/add_point2.component';

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
    { name: "Adaugă un punct", link: '/map/add_point' },
    //{ name: "Favorite", link: '/favorites' },
    // { name: "Istoric căutări", link: '/history' },
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

        if (this.activeTab === '/map/add_point') {
            this.onOpenFirst();
        }
    }

    onOpenFirst(): void {
        const dialogRef1 = this.dialog.open(AddPoint1Component);
    
        // Listen for the `nextPage` event
        dialogRef1.componentInstance.nextPage.subscribe(() => {
          dialogRef1.componentInstance.onClose();
          this.onOpenSecond();
        });
    
        dialogRef1.afterClosed().subscribe((result) => {
            this.router.navigate(['/map']);
            console.log('First dialog closed with result:', result);
        });
      }
    
    onOpenSecond(): void {
        const dialogRef2 = this.dialog.open(AddPoint2Component);
    
        dialogRef2.afterClosed().subscribe((result) => {
            this.router.navigate(['/map']);
            console.log('Second dialog closed with result:', result);
        });
    }

  // Function to handle map loaded event
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  isMainPage(): boolean {
    const mainPages = ['/map', '/map/add_point'];
    return mainPages.includes(this.activeTab);
  }

  shouldShowToolbar(): boolean {
    const noToolbarPages = ['/login', '/authenticate']; // Add routes where toolbar shouldn't appear
    return !noToolbarPages.includes(this.activeTab);
  }
  
}
