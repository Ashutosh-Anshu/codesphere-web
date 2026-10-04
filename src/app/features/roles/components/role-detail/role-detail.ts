import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Inject, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';

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
import { finalize, lastValueFrom } from 'rxjs';
import { RoleDetailModel, RoleMenu } from '../../../../core/models';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


interface RoleDialogData {
  mode: ViewMode;
  roleId?: string;
}

@Component({
  selector: 'app-role-detail',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
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


  onCancel(): void {
    this.dialogRef.close();
  }


  // ========================================

  private readonly dialogData = inject(MAT_DIALOG_DATA) as {
    mode: ViewMode;
    roleId?: string;
  };

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<RoleDetail>);
  public rawRoleForm!: RoleDetailModel;
  public readonly roleMenu = signal<RoleMenu[]>([]);

  roleForm = this.fb.nonNullable.group({
    roleId: [''],
    name: ['', Validators.required],
    description: ['', Validators.maxLength(500)],
    isActive: [true],
    isSystem: [false],

    permissions: this.fb.array<ReturnType<typeof this.createPermissionForm>>([]),
  });

  private createPermissionForm(
    menuId: string,
    actionId: string,
    isAllowed = false
  ) {
    return this.fb.nonNullable.group({
      menuId: [menuId],
      actionId: [actionId],
      isAllowed: [isAllowed],
    });
  }

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
          }
        },
      });

    switch (this.dialogData.mode) {
      case ViewMode.Add:
        this.isAddMode = true;
        this.cloneDeep();
        break;

      case ViewMode.Edit:
        this.isEditMode = true;
        this.loadRole(this.dialogData.roleId ?? '');
        break;

      default:
        this.isViewMode = true;
        break;
    }
  }


  private loadRole(id: string): void {
    super.startLoading();

    this.userService
      .getProductById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.roleForm.patchValue(response.data);
            this.cloneDeep();
          } else {
            console.error(
              'Error fetching product:',
              response.message
            );
          }
        },
        error: (error) => {
          console.error('Error fetching product:', error);
        }
      });
  }

  private cloneDeep(): void {
    this.rawRoleForm = _.cloneDeep(this.roleForm.getRawValue()) as RoleDetailModel;
  }

}
