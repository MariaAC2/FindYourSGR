import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private userEmail = "";

  constructor() {}

  login(email: string): Observable<{ success: boolean }> {
      this.isAuthenticated = true;
      this.userEmail = email;
      console.log(this.userEmail);
      return of({ success: true });
  }

  logout() {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
  getEmail(): String {
    return this.userEmail;
  }
}
