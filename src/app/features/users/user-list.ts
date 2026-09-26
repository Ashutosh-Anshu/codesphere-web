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
import { UserDetail } from './components/user-detail/user-detail';


export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string | Date;
  modifiedAt: string | Date;
}

@Component({
  selector: 'app-user-list',
  imports: [
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatSortModule, MatPaginatorModule, MatMenuModule,
    DatePipe, FormsModule, MatDividerModule, MatSelectModule
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {

  searchText = '';
  selectedRole = '';
  selectedStatus = '';
  private readonly router = inject(Router);
  roles = [
    { id: 'ADMIN', name: 'Administrator' },
    { id: 'MANAGER', name: 'Manager' },
    { id: 'USER', name: 'User' }
  ];

  displayedColumns: string[] = [
    'user',
    'email',
    'role',
    'status',
    'modifiedAt',
    'actions'
  ];

  dataSource = new MatTableDataSource<User>([]);

  totalUsers = 0;
  pageIndex = 0;
  pageSize = 10;

  visibleUsers = signal<User[]>([]);

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
    }
  ];


  // ==============================================================
  // USER ACTIONS
  // ==============================================================





  onEditUser(userId: number): void {
    // Open Edit User dialog
  }


  onManageRoles(userId: number): void {
    // Open Manage Roles dialog
  }


  onManagePermissions(userId: number): void {
    // Open Manage Permissions dialog
  }


  onActivateUser(userId: number): void {
    // Activate user
  }


  onDeactivateUser(userId: number): void {
    // Deactivate user
  }


  onDeleteUser(userId: number): void {
    // Delete user
  }


  // ==============================================================
  // SEARCH
  // ==============================================================


  onSearch(): void {
    // Call API with:
    // searchText
    // selectedRole
    // selectedStatus
  }


  // ==============================================================
  // PAGINATION
  // ==============================================================


  onPageChange(event: PageEvent): void {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    // Load users from API
  }


  // ==============================================================
  // MOBILE
  // ==============================================================


  applyMobileSort(sortId: string): void {

    const users = [...this.visibleUsers()];

    switch (sortId) {

      case 'nameAsc':
        users.sort((a, b) =>
          `${a.firstName} ${a.lastName}`
            .localeCompare(`${b.firstName} ${b.lastName}`)
        );
        break;

      case 'nameDesc':
        users.sort((a, b) =>
          `${b.firstName} ${b.lastName}`
            .localeCompare(`${a.firstName} ${a.lastName}`)
        );
        break;

      case 'recent':
        users.sort(
          (a, b) =>
            new Date(b.modifiedAt).getTime() -
            new Date(a.modifiedAt).getTime()
        );
        break;

      case 'oldest':
        users.sort(
          (a, b) =>
            new Date(a.modifiedAt).getTime() -
            new Date(b.modifiedAt).getTime()
        );
        break;
    }

    this.visibleUsers.set(users);
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

      default:
        return 'sort';
    }
  }

  logout(): void {
    // Later you can clear your token here
    // this.tokenService.clearTokens();

    this.router.navigate(['/identityAccess/login']);
  }


  // ==============================================================
  // HELPERS
  // ==============================================================


  getInitials(user: User): string {

    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';

    return `${first}${last}`.toUpperCase();
  }


  getStatusLabel(status: User['status']): string {

    switch (status) {

      case 'ACTIVE':
        return 'Active';

      case 'INACTIVE':
        return 'Inactive';

      case 'SUSPENDED':
        return 'Suspended';

      default:
        return status;
    }
  }

  // ====================================================

  private readonly dialogService = inject(DialogService);

  onAddUser(): void {
    this.openUserDialog(ViewMode.Add);
  }

  onAddRole(): void {
    this.router.navigate(['/identityAccess/roles']);
  }

  private openUserDialog(mode: ViewMode, userId?: string): void {
    this.dialogService
      .open(UserDetail,
        { mode, userId },
        {
          width: '580px'
        }
      )
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          //this.loadProducts();
        }
      });
  }


}
