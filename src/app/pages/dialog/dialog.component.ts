import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPoint1Component } from '../add_point1/add_point1.component';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {
        this.openDialog(); // Automatically open the dialog
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AddPoint1Component);

        dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog closed with result:', result);
        });
    }
}
