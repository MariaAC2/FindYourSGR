import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add_point1',
  templateUrl: './add_point1.component.html',
  styleUrls: ['./add_point1.component.scss']
})

export class AddPoint1Component {
  selectedService: string = '';

  constructor(private dialogRef: MatDialogRef<AddPoint1Component>) 
  {
    this.dialogRef = null;
  }

  onNext(): void {
    if (this.dialogRef) {
      this.dialogRef.close('openNext');
    } else {
      console.warn('No MatDialogRef available to close the dialog.');
    }
  }

  onClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      console.warn('No MatDialogRef available to close the dialog.');
    }
  }
}
