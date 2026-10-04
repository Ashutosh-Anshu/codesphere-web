import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { BaseListService, DialogService } from '../../core/services';
import { ViewMode } from '../../core/enums';
import { RoleDetail } from './components/role-detail/role-detail';
import { UserService } from '../../core/services/user-service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { QueryParameters } from '../../common';
import { filter, finalize, switchMap } from 'rxjs';
import { Role } from '../../core/models';

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
export class RoleList extends BaseListService implements OnInit {
  // private readonly router = inject(Router);

  // searchText = '';
  // selectedStatus = '';

  // displayedColumns: string[] = [
  //   'name',
  //   'code',
  //   'description',
  //   'status',
  //   'createdAt',
  //   'modifiedAt',
  //   'actions'
  // ];

  // dataSource = new MatTableDataSource<Role>([]);

  // totalRoles = 0;
  // pageIndex = 0;
  // pageSize = 10;

  // visibleRoles = signal<Role[]>([]);

  // mobileSortOptions = [
  //   {
  //     id: 'nameAsc',
  //     label: 'Name A-Z'
  //   },
  //   {
  //     id: 'nameDesc',
  //     label: 'Name Z-A'
  //   },
  //   {
  //     id: 'recent',
  //     label: 'Recently Modified'
  //   },
  //   {
  //     id: 'oldest',
  //     label: 'Oldest Modified'
  //   },
  //   {
  //     id: 'recentCreated',
  //     label: 'Recently Created'
  //   },
  //   {
  //     id: 'oldestCreated',
  //     label: 'Oldest Created'
  //   }
  // ];

  // onAddRole(): void {
  //   this.openRoleDialog(ViewMode.Add);
  // }

  // onEditRole(roleId: string): void {
  //   this.openRoleDialog(ViewMode.Edit, roleId);
  // }

  // onDeleteRole(roleId: string): void {
  //   this.deleteRole(roleId);
  // }

  // onSearch(): void {
  //   const search = this.searchText.trim().toLowerCase();

  //   const filteredRoles = this.getRoles().filter((role) => {
  //     const matchesSearch =
  //       !search ||
  //       role.name.toLowerCase().includes(search) ||
  //       role.code.toLowerCase().includes(search) ||
  //       role.description.toLowerCase().includes(search);

  //     const matchesStatus =
  //       !this.selectedStatus ||
  //       role.status === this.selectedStatus;

  //     return matchesSearch && matchesStatus;
  //   });

  //   this.totalRoles = filteredRoles.length;
  //   this.pageIndex = 0;

  //   this.dataSource.data = filteredRoles;

  //   this.visibleRoles.set(
  //     filteredRoles.slice(0, this.pageSize)
  //   );
  // }

  // onPageChange(event: PageEvent): void {
  //   this.pageIndex = event.pageIndex;
  //   this.pageSize = event.pageSize;

  //   const roles = this.dataSource.data;

  //   const startIndex = this.pageIndex * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;

  //   this.visibleRoles.set(
  //     roles.slice(startIndex, endIndex)
  //   );
  // }

  // applyMobileSort(sortId: string): void {
  //   const roles = [...this.dataSource.data];

  //   switch (sortId) {
  //     case 'nameAsc':
  //       roles.sort((a, b) =>
  //         a.name.localeCompare(b.name)
  //       );
  //       break;

  //     case 'nameDesc':
  //       roles.sort((a, b) =>
  //         b.name.localeCompare(a.name)
  //       );
  //       break;

  //     case 'recent':
  //       roles.sort(
  //         (a, b) =>
  //           new Date(b.modifiedAt).getTime() -
  //           new Date(a.modifiedAt).getTime()
  //       );
  //       break;

  //     case 'oldest':
  //       roles.sort(
  //         (a, b) =>
  //           new Date(a.modifiedAt).getTime() -
  //           new Date(b.modifiedAt).getTime()
  //       );
  //       break;

  //     case 'recentCreated':
  //       roles.sort(
  //         (a, b) =>
  //           new Date(b.createdAt).getTime() -
  //           new Date(a.createdAt).getTime()
  //       );
  //       break;

  //     case 'oldestCreated':
  //       roles.sort(
  //         (a, b) =>
  //           new Date(a.createdAt).getTime() -
  //           new Date(b.createdAt).getTime()
  //       );
  //       break;
  //   }

  //   this.dataSource.data = roles;

  //   const startIndex = this.pageIndex * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;

  //   this.visibleRoles.set(
  //     roles.slice(startIndex, endIndex)
  //   );
  // }



  // getStatusLabel(status: Role['status']): string {
  //   switch (status) {
  //     case 'ACTIVE':
  //       return 'Active';

  //     case 'INACTIVE':
  //       return 'Inactive';

  //     default:
  //       return status;
  //   }
  // }

  // getStatusClass(status: Role['status']): string {
  //   switch (status) {
  //     case 'ACTIVE':
  //       return 'bg-green-500';

  //     case 'INACTIVE':
  //       return 'bg-gray-400';

  //     default:
  //       return 'bg-gray-400';
  //   }
  // }

  // getInitials(role: Role): string {
  //   return role.name
  //     .split(' ')
  //     .map((part) => part.charAt(0))
  //     .join('')
  //     .substring(0, 2)
  //     .toUpperCase();
  // }

  // private openRoleDialog(
  //   mode: ViewMode,
  //   roleId?: string
  // ): void {

  //   this.dialogService
  //     .open(
  //       RoleDetail,
  //       {
  //         mode,
  //         roleId
  //       },
  //       {
  //         width: '900px',
  //         maxWidth: 'calc(100vw - 24px)',
  //         height: '82vh',
  //         maxHeight: 'calc(100vh - 24px)',
  //         disableClose: true,
  //         autoFocus: false,
  //         panelClass: 'role-dialog'
  //       }
  //     )
  //     .afterClosed()
  //     .subscribe((result) => {

  //       if (result) {
  //         this.onSearch();
  //       }

  //     });
  // }

  // private deleteRole(roleId: string): void {
  //   this.dataSource.data = this.dataSource.data.filter(
  //     (role) => role.roleId !== roleId
  //   );

  //   this.totalRoles = this.dataSource.data.length;

  //   const startIndex = this.pageIndex * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;

  //   this.visibleRoles.set(
  //     this.dataSource.data.slice(startIndex, endIndex)
  //   );
  // }

  // private getRoles(): Role[] {
  //   return this.dataSource.data;
  // }



  // ================================

  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dataSource = new MatTableDataSource<Role>([]);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  public readonly visibleProducts = toSignal(this.dataSource.connect(), {
    initialValue: [] as Role[],
  });

  public readonly displayedColumns: string[] = [
    'name',
    'description',
    'status',
    'updatedAt',
    'actions'
  ];

  public readonly mobileSortOptions = [
    { id: 'nameAsc', label: 'Name A-Z' },
    { id: 'nameDesc', label: 'Name Z-A' },
    { id: 'recent', label: 'Recently Modified' },
    { id: 'oldest', label: 'Oldest Modified' },
  ];

  public totalRoles = 0;
  public pageSize = 5;
  public pageIndex = 0;
  public searchText = '';
  public visibleRoles = signal<Role[]>([]);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(resetPage = false): void {
    if (resetPage) {
      this.pageIndex = 0;
    }

    const queryParameters: QueryParameters = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      searchValue: this.searchText?.trim() || null
    };

    super.startLoading();

    this.userService
      .getAllRoleAsync(queryParameters)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource.data = response.data.items;
            this.totalRoles = response.data.totalCount;
          } else {
            this.dataSource.data = [];
            this.totalRoles = 0;
            console.error('Error fetching roles:', response.message);
          }
        },
        error: (error) => {
          this.dataSource.data = [];
          this.totalRoles = 0;
          console.error('Error fetching roles:', error);
        },
      });
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadRoles();
  }

  onAddRole(): void {
    this.openRoleDialog(ViewMode.Add);
  }


  private openRoleDialog(mode: ViewMode, roleId?: string): void {
    this.dialogService
      .open(RoleDetail,
        { mode, roleId },
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
          this.loadRoles();
        }
      });
  }

  onEditRole(roleId: string): void {
    this.openRoleDialog(ViewMode.Edit, roleId);
  }

  onDeleteRole(roleId: string): void {
    this.dialogService
      .openDeleteConfirmation()
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => this.userService.deleteUser(roleId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadRoles();
          }
        },
        error: (error) => console.error('Error deleting product:', error),
      });
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
            new Date(b.updatedAt ?? 0).getTime() -
            new Date(a.updatedAt ?? 0).getTime()
        );
        break;

      case 'oldest':
        roles.sort(
          (a, b) =>
            new Date(a.updatedAt ?? 0).getTime() -
            new Date(b.updatedAt ?? 0).getTime()
        );
        break;
    }
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

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRoles();
  }
}
