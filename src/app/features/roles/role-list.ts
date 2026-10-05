import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
import { Product, Role } from '../../core/models';

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
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  deleteRoleById(roleId: string): void {
    this.dialogService
      .openDeleteConfirmation()
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => this.userService.deleteRoleById(roleId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadRoles();
          }
        },
        error: (error) => console.error('Error deleting role:', error),
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

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: Role, column: string) => {
      switch (column) {
        case 'name':
          return item.name?.toLowerCase() ?? '';
        case 'updatedAt':
          return item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
        default:
          return item[column as keyof Role] as string | number;
      }
    };
  }
}
