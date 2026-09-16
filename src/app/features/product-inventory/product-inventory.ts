import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BaseListService, DialogService, ProductService } from '../../core/services';
import { Product } from '../../core/models';
import { ViewMode } from '../../core/enums';
import { ProductDetail } from './product-detail/product-detail';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialog } from '../../common';

@Component({
  selector: 'app-product-inventory',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    CurrencyPipe,
    DatePipe,
    FormsModule
  ],
  templateUrl: './product-inventory.html',
  styleUrl: './product-inventory.css',
})
export class ProductInventory extends BaseListService implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  public readonly products = signal<Product[]>([]);
  public searchText = '';
  private service = inject(ProductService);
  private dialogService = inject(DialogService);
  private readonly dialog = inject(MatDialog);
  public productColumns: string[] = [
    'name',
    'description',
    'price',
    'stock',
    'modifiedAt',
    'actions'
  ];

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    super.startLoading();
    this.service
      .getAllAsync(this.searchText || null)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.products.set(response.data as Product[]);
          } else {
            console.error('Error fetching products:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        },

      });
  }

  showProductDetail(mode: ViewMode, productId?: string): void {
    const dialogRef = this.dialogService.open(ProductDetail, {
      mode,
      productId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initData();
      }
    });
  }

  addProduct(): void {
    this.showProductDetail(ViewMode.Add);
  }

  editProduct(productId: string): void {
    this.showProductDetail(ViewMode.Edit, productId);
  }

  deleteProduct(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '420px',
      maxWidth: 'calc(100vw - 2rem)',
      data: {
        message: 'Are you sure you want to delete this product? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.deleteProduct(id).subscribe({
          next: (response) => {
            if (response.success) {
              console.log('Product deleted successfully');
              this.initData();
            } else {
              console.error('Error deleting product:', response.message);
            }
          },
          error: (error) => {
            console.error('Error deleting product:', error);
          }
        })
      }
    });
  }

  onSearch() {
    const search = this.searchText?.trim().toLowerCase();
    this.initData();
  }

}

