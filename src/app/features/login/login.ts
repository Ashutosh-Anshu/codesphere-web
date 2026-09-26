import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

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
    private readonly router = inject(Router);

    hide = signal(true);
    isLoading = signal(false);

    loginForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        rememberMe: [false],
    });

    login(): void {
        debugger
        // if (this.loginForm.invalid) {
        //     this.loginForm.markAllAsTouched();
        //     return;
        // }

        // this.isLoading.set(true);

        // const credentials = this.loginForm.getRawValue();

        // console.log('Login:', credentials);

        this.router.navigate(['/identityAccess/users']);
    }

    togglePassword(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        this.hide.update(value => !value);
    }
}

