import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add_point1',
  templateUrl: './add_point1.component.html',
  styleUrls: ['./add_point1.component.scss']
})

export class AddPoint1Component {
  selectedService: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddPoint1Component>,
    private router: Router
    ) {}

  // Închide dialogul și trimite datele selectate
  onNext(): void {
    this.dialogRef.close(this.selectedService);

    setTimeout(() => {
        this.router.navigate(['/add_point2']);
      }, 0);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
