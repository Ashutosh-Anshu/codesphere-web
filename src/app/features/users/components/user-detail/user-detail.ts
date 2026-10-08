import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseDetailService, DialogService, UserService } from '../../../../core/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RoleItem, UserDetailModel } from '../../../../core/models';
import { ViewMode } from '../../../../core/enums';
import _ from 'lodash';
import { filter, finalize } from 'rxjs';

interface UserDetailData {
  mode: ViewMode;
  userId?: string;
}

@Component({
  selector: 'app-user-detail',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail extends BaseDetailService {

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<UserDetail>);
  public rawUserForm!: UserDetailModel;
  public readonly roleItem = signal<RoleItem[]>([]);

  private readonly dialogData = inject(MAT_DIALOG_DATA) as {
    mode: ViewMode;
    userId?: string;
  };

  private passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  };

  userForm = this.fb.nonNullable.group(
    {
      userId: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      roleId: ['', Validators.required],
      isActive: [true],
    },
    {
      validators: this.passwordMatchValidator
    }
  );

  ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {

    this.userService
      .getAllUserRoles()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.roleItem.set(response);
            switch (this.dialogData.mode) {

              case ViewMode.Add:
                this.isAddMode = true;
                this.userForm.get('password')?.setValidators([
                  Validators.required,
                  Validators.minLength(4)
                ]);

                this.userForm.get('confirmPassword')?.setValidators([
                  Validators.required
                ]);
                this.userForm.get('userId')?.clearValidators();
                this.userForm.get('password')?.updateValueAndValidity();
                this.userForm.get('confirmPassword')?.updateValueAndValidity();
                this.cloneDeep();
                break;

              case ViewMode.Edit:
                this.isEditMode = true;
                this.userForm.get('password')?.clearValidators();
                this.userForm.get('confirmPassword')?.clearValidators();

                this.userForm.get('password')?.updateValueAndValidity();
                this.userForm.get('confirmPassword')?.updateValueAndValidity();
                this.getUserById(this.dialogData.userId ?? '');
                break;

              default:
                this.isViewMode = true;
                break;
            }
          }
        },
      });
  }

  private getUserById(userId: string): void {

    if (!userId) return;

    super.startLoading();

    this.userService
      .getUserById(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const user = response.data as UserDetailModel;
            this.userForm.patchValue({
              userId: user.userId?.toString() ?? '',
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              roleId: user.roleId,
              isActive: user.isActive,
              password: user.password ?? '',
              confirmPassword: user.password ?? ''
            });
            this.cloneDeep();
          } else {

            console.error(
              'Error fetching role:',
              response.message
            );

          }
        },

        error: (error) => {
          console.error(
            'Error fetching role:',
            error
          );
        }
      });
  }

  private cloneDeep(): void {
    this.rawUserForm = _.cloneDeep(this.userForm.getRawValue()) as UserDetailModel;
  }

  private hasUnsavedChanges(): boolean {
    return !_.isEqual(
      this.rawUserForm,
      this.userForm.getRawValue()
    );
  }

  private trimFormValues(): void {
    const values = this.userForm.getRawValue();

    Object.keys(values).forEach((key) => {
      const value = values[key as keyof typeof values];

      if (typeof value === 'string') {
        this.userForm.get(key)?.setValue(value.trim());
      }
    });
  }

  saveUser(): void {
    this.trimFormValues();
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (!this.hasUnsavedChanges()) {
      this.dialogRef.close(true);
      return;
    }

    const payload: UserDetailModel = this.userForm.getRawValue();
    payload.userId = this.isAddMode ? '00000000-0000-0000-0000-000000000000' : payload.userId;
    super.startLoading();

    this.userService.createOrUpdateUserAsync(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
            return;
          }

          console.error('Error saving user:', response.message);
        },

        error: (error) => {
          console.error('Error saving user:', error);
        }
      });
  }

  close(): void {
    if (!this.hasUnsavedChanges()) {
      this.dialogRef.close(false);
      return;
    }

    this.confirmUnsavedChanges();
  }

  private confirmUnsavedChanges(): void {
    this.dialogService
      .openUnsavedConfirmation()
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => {
        switch (result) {
          case 'cancel':
            break;

          case 'discard':
            this.dialogRef.close(false);
            break;

          case 'save':
            this.saveUser();
            break;
        }
      });
  }
}
