import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      keepLoggedIn: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:5000/api/auth/login', this.loginForm.value).subscribe(
        (response: any) => {
          window.localStorage.setItem('token', response.data);
          this.snackBar.open('Login successful!', 'Close', { duration: 5000 });
          this.router.navigate(['/']);
        },
        (error) => {
          this.snackBar.open(error.error.message, 'Close', { duration: 5000 });
        }
      );
    }
  }

  get buttonClass() {
    return this.loginForm.invalid ? 'inactive' : 'active';
  }
}

// the actual code for the login component
/*
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/database';  // Import AngularFireDatabase

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private db: AngularFireDatabase  // Inject AngularFireDatabase
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      keepLoggedIn: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;

      // Push data to Firebase Realtime Database under 'users' node
      const userRef = this.db.list('users');  // Firebase list reference
      userRef.push(userData).then(() => {
        this.snackBar.open('Login successful and data saved to Firebase!', 'Close', { duration: 5000 });
        this.router.navigate(['/']);
      }).catch((error) => {
        this.snackBar.open('Failed to save data to Firebase: ' + error.message, 'Close', { duration: 5000 });
      });
    }
  }

  get buttonClass() {
    return this.loginForm.invalid ? 'inactive' : 'active';
  }
}
 */
