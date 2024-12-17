import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add_point1',
  templateUrl: './add_point1.component.html',
  styleUrls: ['./add_point1.component.scss']
})

export class AddPoint1Component {
  selectedService: string = ''; // Tipul de serviciu (Punct SGR sau Cos de gunoi)

  constructor(private dialogRef: MatDialogRef<AddPoint1Component>) {}

  // Închide dialogul și trimite datele selectate
  onNext(): void {
    this.dialogRef.close('openNext');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
