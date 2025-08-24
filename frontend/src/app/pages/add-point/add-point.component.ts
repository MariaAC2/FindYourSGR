import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
 
@Component({
  selector: 'app-add-point',
  templateUrl: './add-point.component.html',
  styleUrls: [],
})
export class AddPointComponent {
  currentPage: number = 1;
  selectedServiceType: string | null = null;
  locationData: { latitude: number; longitude: number };


  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public router: Router,
    private authService: AuthService
  ){

  };
 
  goToNextPage(): void {
    // this.selectedServiceType = selectedType;
    this.currentPage = 2;
  }
 
  // saveLocationData(location: any): void {
  //   this.locationData = location;
  //   if (this.locationData && this.selectedServiceType) {
  //     // Extract required fields for the payload
  //     const payload = {
  //       type: this.selectedServiceType,
  //       address: this.locationData
  //         ? 'Search Address Location' // Use appropriate value or prompt user
  //         : 'Current Location',
  //       latitude: this.locationData.latitude,
  //       longitude: this.locationData.longitude
          
  //     };
   
  //     // Send the payload to the backend
  //     this.http.post('http://localhost:1111/add_point', payload).subscribe(
  //       (response: any) => {
  //         this.snackBar.open('Point added successfully!', 'Close', { duration: 5000 });
  //         this.router.navigate(['/account']);
  //       },
  //       (error) => {
  //         this.snackBar.open(error.error.message, 'Close', { duration: 5000 });
  //       }
  //     );
  //   } else {
  //     this.snackBar.open('Please provide all necessary information.', 'Close', { duration: 5000 });
  //   }
  // }
 

}