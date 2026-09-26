import { Component, inject, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { DialogService } from '../../core/services';
import { ViewMode } from '../../core/enums';
import { RoleDetail } from './components/role-detail/role-detail';




export interface Role {
  roleId: string;
  name: string;
  code: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  modifiedAt: string;
}


@Component({
  selector: 'app-role-list',
  imports: [
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatSortModule, MatPaginatorModule, MatMenuModule,
    DatePipe, FormsModule, MatDividerModule, MatSelectModule
  ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
})
export class RoleList {
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  searchText = '';
  selectedStatus = '';

  displayedColumns: string[] = [
    'name',
    'code',
    'description',
    'status',
    'createdAt',
    'modifiedAt',
    'actions'
  ];

  dataSource = new MatTableDataSource<Role>([]);

  totalRoles = 0;
  pageIndex = 0;
  pageSize = 10;

  visibleRoles = signal<Role[]>([]);

  mobileSortOptions = [
    {
      id: 'nameAsc',
      label: 'Name A-Z'
    },
    {
      id: 'nameDesc',
      label: 'Name Z-A'
    },
    {
      id: 'recent',
      label: 'Recently Modified'
    },
    {
      id: 'oldest',
      label: 'Oldest Modified'
    },
    {
      id: 'recentCreated',
      label: 'Recently Created'
    },
    {
      id: 'oldestCreated',
      label: 'Oldest Created'
    }
  ];

  onAddRole(): void {
    this.openRoleDialog(ViewMode.Add);
  }

  onEditRole(roleId: string): void {
    this.openRoleDialog(ViewMode.Edit, roleId);
  }

  onDeleteRole(roleId: string): void {
    this.deleteRole(roleId);
  }

  onSearch(): void {
    const search = this.searchText.trim().toLowerCase();

    const filteredRoles = this.getRoles().filter((role) => {
      const matchesSearch =
        !search ||
        role.name.toLowerCase().includes(search) ||
        role.code.toLowerCase().includes(search) ||
        role.description.toLowerCase().includes(search);

      const matchesStatus =
        !this.selectedStatus ||
        role.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.totalRoles = filteredRoles.length;
    this.pageIndex = 0;

    this.dataSource.data = filteredRoles;

    this.visibleRoles.set(
      filteredRoles.slice(0, this.pageSize)
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    const roles = this.dataSource.data;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.visibleRoles.set(
      roles.slice(startIndex, endIndex)
    );
  }

  applyMobileSort(sortId: string): void {
    const roles = [...this.dataSource.data];

    switch (sortId) {
      case 'nameAsc':
        roles.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case 'nameDesc':
        roles.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      case 'recent':
        roles.sort(
          (a, b) =>
            new Date(b.modifiedAt).getTime() -
            new Date(a.modifiedAt).getTime()
        );
        break;

      case 'oldest':
        roles.sort(
          (a, b) =>
            new Date(a.modifiedAt).getTime() -
            new Date(b.modifiedAt).getTime()
        );
        break;

      case 'recentCreated':
        roles.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        break;

      case 'oldestCreated':
        roles.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        );
        break;
    }

    this.dataSource.data = roles;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.visibleRoles.set(
      roles.slice(startIndex, endIndex)
    );
  }

  getSortIcon(sortId: string): string {
    switch (sortId) {
      case 'nameAsc':
        return 'arrow_upward';

      case 'nameDesc':
        return 'arrow_downward';

      case 'recent':
        return 'schedule';

      case 'oldest':
        return 'history';

      case 'recentCreated':
        return 'add_circle';

      case 'oldestCreated':
        return 'calendar_today';

      default:
        return 'sort';
    }
  }

  getStatusLabel(status: Role['status']): string {
    switch (status) {
      case 'ACTIVE':
        return 'Active';

      case 'INACTIVE':
        return 'Inactive';

      default:
        return status;
    }
  }

  getStatusClass(status: Role['status']): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';

      case 'INACTIVE':
        return 'bg-gray-400';

      default:
        return 'bg-gray-400';
    }
  }

  getInitials(role: Role): string {
    return role.name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

private openRoleDialog(
  mode: ViewMode,
  roleId?: string
): void {

  this.dialogService
    .open(
      RoleDetail,
      {
        mode,
        roleId
      },
      {
        width: '900px',
        maxWidth: 'calc(100vw - 24px)',
        height: '82vh',
        maxHeight: 'calc(100vh - 24px)',
        disableClose: true,
        autoFocus: false,
        panelClass: 'role-dialog'
      }
    )
    .afterClosed()
    .subscribe((result) => {

      if (result) {
        this.onSearch();
      }

    });
}

  private deleteRole(roleId: string): void {
    this.dataSource.data = this.dataSource.data.filter(
      (role) => role.roleId !== roleId
    );

    this.totalRoles = this.dataSource.data.length;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.visibleRoles.set(
      this.dataSource.data.slice(startIndex, endIndex)
    );
  }

  private getRoles(): Role[] {
    return this.dataSource.data;
  }
}

