import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ViewMode } from '../../../../core/enums';
import { BaseDetailService, DialogService, UserService } from '../../../../core/services';
import _ from 'lodash';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, finalize } from 'rxjs';
import { RoleDetailModel, RoleMenu, RolePermission } from '../../../../core/models';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


interface RoleDialogData {
  mode: ViewMode;
  roleId?: string;
}

type PermissionFormGroup = FormGroup<{
  menuId: FormControl<string>;
  permissionId: FormControl<string>;
  isAllowed: FormControl<boolean>;
}>;

@Component({
  selector: 'app-role-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './role-detail.html',
  styleUrl: './role-detail.css'
})

export class RoleDetail extends BaseDetailService {

  private readonly data = inject<RoleDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<RoleDetail>);
  public rawRoleForm!: RoleDetailModel;
  public readonly roleMenu = signal<RoleMenu[]>([]);
  private readonly dialogData = inject(MAT_DIALOG_DATA) as {
    mode: ViewMode;
    roleId?: string;
  };

  roleForm = this.fb.nonNullable.group({
    roleId: [''],
    name: ['', Validators.required],
    description: ['', Validators.maxLength(500)],
    isActive: [true],
    isSystem: [false],
    permissions: this.fb.array<PermissionFormGroup>([]),
  });

  ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {

    this.userService
      .getAllRoleMenu()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.roleMenu.set(response.data);
            this.buildPermissionForm(response.data);
            switch (this.dialogData.mode) {

              case ViewMode.Add:
                this.isAddMode = true;
                this.cloneDeep();
                break;

              case ViewMode.Edit:
                this.isEditMode = true;
                this.getRoleById(this.dialogData.roleId ?? '');
                break;

              default:
                this.isViewMode = true;
                break;
            }
          }
        },
      });
  }

  private buildPermissionForm(menus: RoleMenu[]): void {
    const permissions = this.roleForm.controls.permissions;
    permissions.clear();
    menus.forEach(menu => {
      menu.permissions.forEach(permission => {
        const permissionGroup: PermissionFormGroup =
          new FormGroup({
            menuId: new FormControl(menu.menuId, { nonNullable: true }),
            permissionId: new FormControl(permission.permissionId, { nonNullable: true }),
            isAllowed: new FormControl<boolean>(false, { nonNullable: true })
          });
        permissions.push(permissionGroup);
      });
    });
  }

  private getRoleById(roleId: string): void {

    if (!roleId) return;

    super.startLoading();

    this.userService
      .getRoleById(roleId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {

            const role = response.data as RoleDetailModel;

            this.roleForm.patchValue({
              roleId: role.roleId,
              name: role.name,
              description: role.description,
              isActive: role.isActive,
              isSystem: role.isSystem
            });

            this.setSelectedPermissions(
              role.permissions ?? []
            );

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

  private setSelectedPermissions(
    permissions: RolePermission[]
  ): void {

    this.permissionsFormArray.controls.forEach(control => {

      const menuId =
        control.controls.menuId.value;

      const permissionId =
        control.controls.permissionId.value;

      const permission =
        permissions.find(item =>
          item.menuId === menuId &&
          item.permissionId === permissionId
        );

      control.controls.isAllowed.setValue(
        permission?.isAllowed ?? false,
        {
          emitEvent: false
        }
      );
    });
  }

  get permissionsFormArray(): FormArray<PermissionFormGroup> {
    return this.roleForm.controls.permissions;
  }

  getPermissionControl(menuId: string, permissionId: string): FormControl<boolean> {

    const control = this.permissionsFormArray.controls.find(item =>
      item.controls.menuId.value === menuId &&
      item.controls.permissionId.value === permissionId
    );

    if (!control) {
      throw new Error(
        `Permission control not found: ${menuId}/${permissionId}`
      );
    }

    return control.controls.isAllowed;
  }

  isMenuSelected(menuId: string): boolean {

    const permissions =
      this.permissionsFormArray.controls.filter(
        item =>
          item.controls.menuId.value === menuId
      );

    return permissions.length > 0 &&
      permissions.every(
        item =>
          item.controls.isAllowed.value
      );
  }

  onMenuChange(
    menuId: string,
    checked: boolean
  ): void {

    this.permissionsFormArray.controls
      .filter(
        item =>
          item.controls.menuId.value === menuId
      )
      .forEach(item => {

        item.controls.isAllowed.setValue(
          checked
        );

      });
  }

  onPermissionChange(
    menuId: string
  ): void {

    this.permissionsFormArray.updateValueAndValidity();
  }

  private cloneDeep(): void {
    this.rawRoleForm = _.cloneDeep(this.roleForm.getRawValue()) as RoleDetailModel;
  }

  private hasUnsavedChanges(): boolean {
    return !_.isEqual(
      this.rawRoleForm,
      this.roleForm.getRawValue()
    );
  }

  saveRole(): void {

    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    if (!this.hasUnsavedChanges()) {
      this.dialogRef.close(true);
      return;
    }

    const formValue = this.roleForm.getRawValue();

    const payload: RoleDetailModel = {
      roleId: this.isAddMode
        ? '00000000-0000-0000-0000-000000000000'
        : formValue.roleId,
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      isActive: formValue.isActive,
      isSystem: formValue.isSystem,
      updatedAt: null,
      permissions: formValue.permissions
        .filter(x => x.isAllowed)
        .map(
          permission => ({
            menuId: permission.menuId,
            permissionId: permission.permissionId,
            isAllowed: permission.isAllowed
          })
        )
    };

    super.startLoading();

    this.userService.createOrUpdateRoleAsync(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            console.error(
              'Error saving role:',
              response.message
            );
          }
        },

        error: (error) => {
          console.error(
            'Error saving role:',
            error
          );
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
            this.saveRole();
            break;
        }
      });
  }
}
