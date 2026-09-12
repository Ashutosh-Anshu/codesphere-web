import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-crud-implementation',
  standalone: true,
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
  templateUrl: './crud-implementation.html',
  styleUrl: './crud-implementation.css',
})
export class CrudImplementation implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

displayedColumns: string[] = [
  'name',
  'description',
  'price',
  'stock',
  'modifiedAt',
  'actions',   // ← ye missing tha, isliye 3-dot menu render hi nahi ho raha tha
];

  dataSource = new MatTableDataSource<Product>([
    {
      name: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro with 256GB storage',
      price: 999.99,
      stock: 25,
      modifiedAt: '2026-09-12',
    },
    {
      name: 'MacBook Air M3',
      description: 'Apple MacBook Air with M3 chip and 16GB RAM',
      price: 1299.00,
      stock: 18,
      modifiedAt: '2026-09-11',
    },
    {
      name: 'Samsung Galaxy S24',
      description: 'Samsung Galaxy S24 with 128GB storage',
      price: 799.99,
      stock: 32,
      modifiedAt: '2026-09-10',
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Wireless noise cancelling headphones',
      price: 349.99,
      stock: 12,
      modifiedAt: '2026-09-09',
    },
    {
      name: 'iPad Pro 12.9',
      description: 'Apple iPad Pro with M2 chip and 256GB storage',
      price: 1099.00,
      stock: 8,
      modifiedAt: '2026-09-08',
    },
    {
      name: 'Dell XPS 15',
      description: 'Dell XPS laptop with Intel Core i7 processor',
      price: 1499.99,
      stock: 15,
      modifiedAt: '2026-09-07',
    },
    {
      name: 'Logitech MX Master 3S',
      description: 'Wireless ergonomic performance mouse',
      price: 99.99,
      stock: 45,
      modifiedAt: '2026-09-06',
    },
    {
      name: 'AirPods Pro 2',
      description: 'Apple AirPods Pro with active noise cancellation',
      price: 249.99,
      stock: 28,
      modifiedAt: '2026-09-05',
    },
    {
      name: 'Samsung 32" Monitor',
      description: '4K UHD monitor with HDR support',
      price: 429.99,
      stock: 10,
      modifiedAt: '2026-09-04',
    },
    {
      name: 'Kindle Paperwhite',
      description: '6.8-inch Kindle Paperwhite e-reader',
      price: 139.99,
      stock: 20,
      modifiedAt: '2026-09-03',
    }
    ,
    {
      name: 'MacBook Air M3',
      description: 'Apple MacBook Air with M3 chip and 16GB RAM',
      price: 1299.00,
      stock: 18,
      modifiedAt: '2026-09-11',
    },
    {
      name: 'Samsung Galaxy S24',
      description: 'Samsung Galaxy S24 with 128GB storage',
      price: 799.99,
      stock: 32,
      modifiedAt: '2026-09-10',
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Wireless noise cancelling headphones',
      price: 349.99,
      stock: 12,
      modifiedAt: '2026-09-09',
    },
    {
      name: 'iPad Pro 12.9',
      description: 'Apple iPad Pro with M2 chip and 256GB storage',
      price: 1099.00,
      stock: 8,
      modifiedAt: '2026-09-08',
    },
    {
      name: 'Dell XPS 15',
      description: 'Dell XPS laptop with Intel Core i7 processor',
      price: 1499.99,
      stock: 15,
      modifiedAt: '2026-09-07',
    },
    {
      name: 'Logitech MX Master 3S',
      description: 'Wireless ergonomic performance mouse',
      price: 99.99,
      stock: 45,
      modifiedAt: '2026-09-06',
    },
    {
      name: 'AirPods Pro 2',
      description: 'Apple AirPods Pro with active noise cancellation',
      price: 249.99,
      stock: 28,
      modifiedAt: '2026-09-05',
    },
    {
      name: 'Samsung 32" Monitor',
      description: '4K UHD monitor with HDR support',
      price: 429.99,
      stock: 10,
      modifiedAt: '2026-09-04',
    },
    {
      name: 'Kindle Paperwhite',
      description: '6.8-inch Kindle Paperwhite e-reader',
      price: 139.99,
      stock: 20,
      modifiedAt: '2026-09-03',
    }
  ]);

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  modifiedAt: string;
}
