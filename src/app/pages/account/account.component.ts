import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ScannerDialogComponent } from '../scanner-dialog/scanner-dialog.component';

interface UserData {
  name: string;
  email: string;
  memberSince: Date;
  points: number;
  rewards: { image: string; title: string }[];
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  userData: UserData | null = null;
  userInitials: string = '';
  pointThresholds = [20, 40, 60, 80]; // Representing Lei thresholds

  constructor(private firestore: AngularFirestore, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.firestore
      .collection('users')
      .doc<UserData>('user-id') // Replace 'user-id' with dynamic logic
      .valueChanges()
      .subscribe((data) => {
        if (data) {
          this.userData = data;
          this.userInitials = this.getInitials(data.name);
        }
      });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  onScanReceipt(): void {
    const dialogRef = this.dialog.open(ScannerDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((barcode) => {
      if (barcode) {
        this.processScannedBarcode(barcode);
      }
    });
  }

  processScannedBarcode(barcode: string): void {
    // Simulate receipt value based on barcode
    const receiptValue = this.getReceiptValue(barcode); // Example function
    const pointsToAdd = Math.floor(receiptValue * 2.5); // 2.5 points per Lei

    if (this.userData) {
      this.userData.points = (this.userData.points || 0) + pointsToAdd;

      // Update in Firebase
      this.firestore
        .collection('users')
        .doc('user-id') // Replace with dynamic user ID logic
        .update({ points: this.userData.points });
    }
  }

  getReceiptValue(barcode: string): number {
    // Simulate fetching receipt value based on barcode
    const values = { '123456': 20, '789012': 40, '345678': 60, '901234': 80 };
    return values[barcode] || 0; // Default to 0 if barcode not recognized
  }

  onCodeScanned(code: string): void {
    console.log('Cod detectat:', code);
    alert(`Cod detectat: ${code}`);
  }
  
  
}
