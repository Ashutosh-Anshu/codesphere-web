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
import { UserDetail } from './components/user-detail/user-detail';
import { Role, User } from '../../core/models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { QueryParameters, AvatarInitialsPipe } from '../../common';
import { UserService } from '../../core/services/user-service';
import { filter, finalize, switchMap } from 'rxjs';


@Component({
  selector: 'app-user-list',
  imports: [
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatSortModule, MatPaginatorModule, MatMenuModule,
    DatePipe, FormsModule, MatDividerModule, MatSelectModule,
    AvatarInitialsPipe
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList extends BaseListService implements OnInit {



  // ======================================
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dataSource = new MatTableDataSource<User>([]);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  public readonly visibleProducts = toSignal(this.dataSource.connect(), {
    initialValue: [] as User[],
  });

  public readonly displayedColumns: string[] = [
    'user', 'email', 'role', 'status', 'modifiedAt', 'actions'
  ];

  public readonly mobileSortOptions = [
    { id: 'nameAsc', label: 'Name A-Z' },
    { id: 'nameDesc', label: 'Name Z-A' },
    { id: 'recent', label: 'Recently Modified' },
    { id: 'oldest', label: 'Oldest Modified' },
  ];

  public totalUsers = 0;
  public pageSize = 5;
  public pageIndex = 0;
  searchText = '';
  selectedRoles: string[] = [];
  selectedStatus = '';
  public visibleUsers = signal<User[]>([]);
  public roles = signal<Role[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(resetPage = false): void {
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
      .getAllAsync(queryParameters, this.selectedRoles)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource.data = response.data.items;
            this.totalUsers = response.data.totalCount;
          } else {
            this.dataSource.data = [];
            this.totalUsers = 0;
            console.error('Error fetching products:', response.message);
          }
        },
        error: (error) => {
          this.dataSource.data = [];
          this.totalUsers = 0;
          console.error('Error fetching products:', error);
        },
      });
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadUsers();
  }

  onAddUser(): void {
    this.openUserDialog(ViewMode.Add);
  }

  onEditUser(userId: string): void {
    this.openUserDialog(ViewMode.Edit, userId);
  }

  onDeleteUser(userId: string): void {
    this.dialogService
      .openDeleteConfirmation()
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => this.userService.deleteUser(userId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadUsers();
          }
        },
        error: (error) => console.error('Error deleting product:', error),
      });
  }

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

  private openUserDialog(mode: ViewMode, userId?: string): void {
    this.dialogService
      .open(UserDetail,
        { mode, userId },
        { width: '580px' }
      )
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadUsers();
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
}
