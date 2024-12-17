import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add_point2',
  templateUrl: './add_point2.component.html',
  styleUrls: ['./add_point2.component.scss']
})
export class AddPoint2Component {
    constructor(private dialogRef: MatDialogRef<AddPoint2Component>) {}

    onClose(): void {
      this.dialogRef.close();
    }
}
