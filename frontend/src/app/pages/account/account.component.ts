// Updated account.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScannerDialogComponent } from '../scanner-dialog/scanner-dialog.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  userData: any = {
    email: String,
    memberSince: new Date('2025-01-17'),
    points: 75,
    rewards: [
      { title: 'Reward 1', image: 'reward1.png' },
      { title: 'Reward 2', image: 'reward2.png' }
    ]
  };

  // userInitials: string = this.userData.email
  //   .split(' ')
  //   .map((n: string) => n[0])
  //   .join('');
  userInitials: string;

  constructor(private dialog: MatDialog, private authService: AuthService) {
    this.userData.email = this.authService.getEmail();
    this.userInitials = this.userData.email
    .split(' ')
    .map((n: string) => n[0])
    .join('');
  }

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