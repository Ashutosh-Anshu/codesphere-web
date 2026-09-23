import { Component, inject, signal, } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MatDialogModule, MatDialogRef, } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<Login>);

  hide = signal(true);

  isLoading = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });


  close(): void {
    this.dialogRef.close();
  }


  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const credentials = this.loginForm.getRawValue();
    console.log('Login:', credentials);

  }


  togglePassword(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.hide.update(value => !value);
  }
}
