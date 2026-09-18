import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { filter, finalize, switchMap } from 'rxjs';
import { BaseListService, DialogService, ProductService } from '../../core/services';
import { Product } from '../../core/models';
import { ViewMode } from '../../core/enums';
import { ProductDetail } from './product-detail/product-detail';

@Component({
  selector: 'app-product-inventory',
  imports: [
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatSortModule, MatPaginatorModule, MatMenuModule,
    CurrencyPipe, DatePipe, FormsModule
  ],
  templateUrl: './product-inventory.html',
  styleUrl: './product-inventory.css',
})
export class ProductInventory extends BaseListService implements OnInit, AfterViewInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);
  private readonly dialogService = inject(DialogService);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public readonly dataSource = new MatTableDataSource<Product>([]);

  public readonly visibleProducts = toSignal(this.dataSource.connect(), {
    initialValue: [] as Product[],
  });

  public readonly displayedColumns: string[] = [
    'name', 'description', 'price', 'stock', 'modifiedAt', 'actions'
  ];

  public readonly mobileSortOptions = [
    { id: 'name', label: 'Name' },
    { id: 'price', label: 'Price' },
    { id: 'stock', label: 'Stock' },
    { id: 'modifiedAt', label: 'Modified At' },
  ];

  public searchText = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Case-insensitive name sort + proper date sort
    this.dataSource.sortingDataAccessor = (item: Product, column: string) => {
      switch (column) {
        case 'name':
          return item.name?.toLowerCase() ?? '';
        case 'modifiedAt':
          return item.modifiedAt ? new Date(item.modifiedAt).getTime() : 0;
        default:
          return item[column as keyof Product] as string | number;
      }
    };
  }

  loadProducts(resetPage = false): void {
    super.startLoading();
    this.productService
      .getAllAsync(this.searchText || null)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dataSource.data = response.data as Product[];
            if (resetPage) {
              this.paginator?.firstPage();
            }
          } else {
            console.error('Error fetching products:', response.message);
          }
        },
        error: (error) => console.error('Error fetching products:', error),
      });
  }

  onSearch(): void {
    this.searchText = this.searchText.trim();
    this.loadProducts(true);
  }

  onAddProduct(): void {
    this.openProductDialog(ViewMode.Add);
  }

  onEditProduct(productId: string): void {
    this.openProductDialog(ViewMode.Edit, productId);
  }

  onDeleteProduct(productId: string): void {
    this.dialogService
      .openDeleteConfirmation()
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => this.productService.deleteProduct(productId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts();
          }
        },
        error: (error) => console.error('Error deleting product:', error),
      });
  }

  applyMobileSort(column: string): void {
    this.sort.sort({ id: column, start: 'asc', disableClear: true });
  }

  getSortIcon(column: string): string {
    if (this.sort?.active !== column) return '';
    return this.sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  private openProductDialog(mode: ViewMode, productId?: string): void {
    this.dialogService
      .open(ProductDetail, { mode, productId })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadProducts();
        }
      });
  }
}