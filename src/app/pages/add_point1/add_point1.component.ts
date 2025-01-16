import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add_point1',
  templateUrl: './add_point1.component.html',
  styleUrls: ['./add_point1.component.scss'],
})
export class AddPoint1Component {
    @Output() nextPage = new EventEmitter<void>();
    serviceTypes: string[] = ['Punct SGR', 'Coș de gunoi'];
    selectedServiceType: string | null = null; // Holds the selected value

    constructor(public dialogRef: MatDialogRef<AddPoint1Component>) {}

    onClose(): void {
        this.dialogRef.close();
        console.log('Dialog has been closed.');
    }

    onNext(): void {
        this.nextPage.emit();
    }

    onServiceChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedServiceType = selectElement.value;
        console.log('Selected Service Type:', this.selectedServiceType);
    }
}
