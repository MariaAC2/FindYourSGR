import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add_point1',
    templateUrl: './add_point1.component.html',
    styleUrls: ['./add_point1.component.scss']
})
export class AddPoint1Component {
    constructor(public dialogRef: MatDialogRef<AddPoint1Component>) {}

    closeDialog(): void {
        this.dialogRef.close(); // Close the dialog
        console.log('Dialog has been closed.');
    }
}
