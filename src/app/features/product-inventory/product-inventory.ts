import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BaseListService, DialogService, ProductService } from '../../core/services';
import { Product } from '../../core/models';
import { ViewMode } from '../../core/enums';
import { ProductDetail } from './product-detail/product-detail';

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
    DatePipe
  ],
  templateUrl: './product-inventory.html',
  styleUrl: './product-inventory.css',
})
export class ProductInventory extends BaseListService implements OnInit {

  private readonly dialog = inject(MatDialog);
  private service = inject(ProductService);
  private dialogService = inject(DialogService);
  public products: Product[] = [];
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
    this.service.getAllAsync().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data as Product[];
        } else {
          console.error('Error fetching products:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

showProductDetail(mode: ViewMode, productId?: string): void {
  const dialogRef = this.dialogService.open(ProductDetail, {
    mode,
    productId
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
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

}

