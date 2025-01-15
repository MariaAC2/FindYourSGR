import { Component } from '@angular/core';

@Component({
  selector: 'app-add-point',
  templateUrl: './add-point.component.html',
  styleUrls: []
})
export class AddPointComponent {
    currentPage: number = 1;

    goToNextPage(): void {
      this.currentPage = 2;
    }
  
    goToPreviousPage(): void {
      this.currentPage = 1;
    }
}
