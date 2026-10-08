import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { filter, finalize, switchMap } from 'rxjs';
import { BaseListService, DialogService, UserService } from '../../core/services';
import { User } from '../../core/models';
import { ViewMode } from '../../core/enums';
import { QueryParameters, AvatarColorPipe, AvatarInitialsPipe } from '../../common';
import { UserDetail } from './components/user-detail/user-detail';

@Component({
  selector: 'app-user-list',
  imports: [
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatSortModule, MatPaginatorModule, MatMenuModule,
    DatePipe, FormsModule,
    AvatarColorPipe,
    AvatarInitialsPipe
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList extends BaseListService implements OnInit, AfterViewInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public readonly dataSource = new MatTableDataSource<User>([]);

  public readonly visibleUsers = toSignal(this.dataSource.connect(), {
    initialValue: [] as User[],
  });

  public readonly displayedColumns: string[] = [
    'fullName', 'email', 'role', 'status', 'updatedAt', 'actions'
  ];

  public readonly mobileSortOptions = [
    { id: 'fullName', label: 'Full Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
    { id: 'updatedAt', label: 'Modified At' },
  ];

  public searchText = '';
  public totalUsers = 0;
  public pageSize = 5;
  public pageIndex = 0;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: User, column: string) => {
      switch (column) {
        case 'fullName':
          return item.fullName?.toLowerCase() ?? '';
        case 'email':
          return item.email?.toLowerCase() ?? '';
        case 'role':
          return item.roleName?.toLowerCase() ?? '';
        case 'status':
          return item.isActive ? 'active' : 'inactive';
        case 'updatedAt':
          return item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
        default:
          return item[column as keyof User] as string | number;
      }
    };
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
      .getAllUsersAsync(queryParameters)
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
            console.error('Error fetching users:', response.message);
          }
        },
        error: (error) => {
          this.dataSource.data = [];
          this.totalUsers = 0;
          console.error('Error fetching users:', error);
        },
      });
  }

  onSearch(): void {
    this.searchText = this.searchText.trim();
    this.pageIndex = 0;
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
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
        error: (error) => console.error('Error deleting user:', error),
      });
  }

  applyMobileSort(column: string): void {
    this.sort.sort({ id: column, start: 'asc', disableClear: true });
  }

  getSortIcon(column: string): string {
    if (this.sort?.active !== column) return '';
    return this.sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  private openUserDialog(mode: ViewMode, userId?: string): void {
    this.dialogService
      .open(UserDetail, { mode, userId }, { width: '580px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadUsers();
        }
      });
  }
}