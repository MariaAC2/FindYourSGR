import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      this.http.post('http://localhost:5000/api/auth/register', userData).subscribe(
        () => {
          this.snackBar.open('Account created successfully!', 'Close', { duration: 5000 });
          this.router.navigate(['/login']);
        },
        (error) => {
          this.snackBar.open(error.error.message || 'An error occurred.', 'Close', { duration: 5000 });
        }
      );
    }
  }
}

/*import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-register',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private db: AngularFireDatabase // Injectează serviciul pentru Firebase Realtime Database
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;

      // Salvează datele în Firebase
      this.db.list('/users').push(userData).then(() => {
        this.snackBar.open('Account created successfully!', 'Close', { duration: 5000 });
        this.router.navigate(['/login']);
      }).catch((error) => {
        this.snackBar.open('An error occurred while saving data.', 'Close', { duration: 5000 });
        console.error(error);
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
 */
