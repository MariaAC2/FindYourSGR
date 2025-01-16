// Updated account.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScannerDialogComponent } from '../scanner-dialog/scanner-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  userData: any = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    memberSince: new Date('2022-01-01'),
    points: 75,
    rewards: [
      { title: 'Reward 1', image: 'reward1.png' },
      { title: 'Reward 2', image: 'reward2.png' }
    ]
  };

  userInitials: string = this.userData.name
    .split(' ')
    .map((n: string) => n[0])
    .join('');

  constructor(private dialog: MatDialog) {}

  openScannerDialog(): void {
    const dialogRef = this.dialog.open(ScannerDialogComponent, {
      width: '400px',
      height: '600px',
      disableClose: true, // Prevent closing when clicking outside
      panelClass: 'scanner-dialog-panel' // Optional custom styling
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Scanner dialog closed', result);
    });
  }
}