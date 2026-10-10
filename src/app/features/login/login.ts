import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { BaseDetailService, UserService } from '../../core/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

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
export class Login extends BaseDetailService {

    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);
    private readonly dialogRef = inject(MatDialogRef<Login>);
    private readonly destroyRef = inject(DestroyRef);
    hide = signal(true);

    loginForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        rememberMe: [false],
    });

    close(): void {
        this.dialogRef.close(false);
    }

    login(): void {
        this.trimFormValues(this.loginForm);

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const credentials = this.loginForm.getRawValue();

        super.startLoading();

        this.userService
            .login(credentials)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => super.stopLoading())
            )
            .subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        const { accessToken, refreshToken, user } = response.data;
                        sessionStorage.setItem('accessToken', accessToken);
                        if (refreshToken) {
                            sessionStorage.setItem('refreshToken', refreshToken);
                        }
                        sessionStorage.setItem('user', JSON.stringify(user));
                        this.userService.refreshMenus();
                        this.router.navigate(['/users']);
                        this.dialogRef.close(true);
                    } else {
                        console.error('Login failed:', response.message);
                    }
                },
                error: (error) => {
                    console.error('Login error:', error);
                }
            });
    }


    togglePassword(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        this.hide.update(value => !value);
    }

    private trimFormValues(form: AbstractControl): void {
        if (form instanceof FormGroup || form instanceof FormArray) {
            Object.values(form.controls).forEach((control) => {
                this.trimFormValues(control);
            });
            return;
        }

        const value = form.value;

        if (typeof value === 'string') {
            form.setValue(value.trim(), { emitEvent: false });
        }
    }
}

