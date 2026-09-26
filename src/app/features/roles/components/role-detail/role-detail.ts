import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

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


interface RoleDialogData {
  mode: ViewMode;
  roleId?: string;
}


interface RolePermission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}


interface RoleMenu {
  name: string;
  code: string;
  description: string;
  expanded: boolean;
  enabled: boolean;
  permissions: RolePermission;
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
    MatSelectModule
  ],

  templateUrl: './role-detail.html',
  styleUrl: './role-detail.css'
})
export class RoleDetail {

  private readonly dialogRef =
    inject(MatDialogRef<RoleDetail>);

  private readonly data =
    inject<RoleDialogData>(MAT_DIALOG_DATA);


  role = {
    name: '',
    code: '',
    description: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  };


  menus: RoleMenu[] = [

    {
      name: 'User Management',
      code: 'USER_MANAGEMENT',
      description: 'Manage application users',
      expanded: true,
      enabled: false,

      permissions: {
        view: false,
        add: false,
        edit: false,
        delete: false
      }
    },

    {
      name: 'Role Management',
      code: 'ROLE_MANAGEMENT',
      description: 'Manage application roles',
      expanded: true,
      enabled: false,

      permissions: {
        view: false,
        add: false,
        edit: false,
        delete: false
      }
    },

    {
      name: 'Product Management',
      code: 'PRODUCT_MANAGEMENT',
      description: 'Manage products',
      expanded: true,
      enabled: false,

      permissions: {
        view: false,
        add: false,
        edit: false,
        delete: false
      }
    },

    {
      name: 'Order Management',
      code: 'ORDER_MANAGEMENT',
      description: 'Manage customer orders',
      expanded: true,
      enabled: false,

      permissions: {
        view: false,
        add: false,
        edit: false,
        delete: false
      }
    },

    {
      name: 'Customer Management',
      code: 'CUSTOMER_MANAGEMENT',
      description: 'Manage customers',
      expanded: true,
      enabled: false,

      permissions: {
        view: false,
        add: false,
        edit: false,
        delete: false
      }
    }

  ];


  get isEditMode(): boolean {
    return this.data?.mode === ViewMode.Edit;
  }


  get pageTitle(): string {
    return this.isEditMode
      ? 'Edit Role'
      : 'Add Role';
  }


  get pageDescription(): string {
    return this.isEditMode
      ? 'Update role information and permissions.'
      : 'Create a role and configure its menu permissions.';
  }


  toggleMenu(menu: RoleMenu): void {
    menu.expanded = !menu.expanded;
  }


  toggleMenuPermissions(menu: RoleMenu): void {

    menu.enabled = !menu.enabled;

    if (!menu.enabled) {

      menu.permissions.view = false;
      menu.permissions.add = false;
      menu.permissions.edit = false;
      menu.permissions.delete = false;

    }
  }


  selectAllPermissions(menu: RoleMenu): void {

    menu.enabled = true;

    menu.permissions.view = true;
    menu.permissions.add = true;
    menu.permissions.edit = true;
    menu.permissions.delete = true;
  }


  clearPermissions(menu: RoleMenu): void {

    menu.permissions.view = false;
    menu.permissions.add = false;
    menu.permissions.edit = false;
    menu.permissions.delete = false;

  }


  hasAnyPermission(menu: RoleMenu): boolean {

    return (
      menu.permissions.view ||
      menu.permissions.add ||
      menu.permissions.edit ||
      menu.permissions.delete
    );
  }


  onSave(): void {

    if (!this.role.name.trim()) {
      return;
    }

    if (!this.role.code.trim()) {
      return;
    }


    const permissions = this.menus
      .filter(menu => menu.enabled)
      .map(menu => ({
        menuCode: menu.code,
        menuName: menu.name,

        actions: {
          view: menu.permissions.view,
          add: menu.permissions.add,
          edit: menu.permissions.edit,
          delete: menu.permissions.delete
        }
      }));


    const payload = {

      role: {
        name: this.role.name.trim(),

        code: this.role.code
          .trim()
          .toUpperCase(),

        description:
          this.role.description.trim(),

        status: this.role.status
      },

      permissions

    };


    console.log(
      'Role Payload:',
      payload
    );


    this.dialogRef.close(payload);
  }


  onCancel(): void {
    this.dialogRef.close();
  }

}
