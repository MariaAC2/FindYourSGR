import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-point',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddPoint1Component {
  selectedService: string = '';

  constructor(private dialogRef: MatDialogRef<AddPoint1Component>) {}

  // Închide dialogul și trimite datele selectate
  onNext(): void {
    this.dialogRef.close(this.selectedService);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
