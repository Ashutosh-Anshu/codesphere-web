import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ViewMode } from '../../../core/enums';
import { BaseDetailService, ProductService } from '../../../core/services';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail extends BaseDetailService implements OnInit {

  private readonly dialogData = inject(MAT_DIALOG_DATA) as {
    mode: ViewMode;
    productId?: string;
  };

  private fb = inject(FormBuilder);
  private service = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<ProductDetail>);
  
  productForm = this.fb.nonNullable.group({
    productId: [''],
    name: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    stock: [0, Validators.required],
  });


  ngOnInit() {
    this.initData();
  }

  initData() {
    if (this.dialogData.mode === ViewMode.Add) {
      this.isAddMode = true;
    } else if (this.dialogData.mode === ViewMode.Edit) {
      this.loadProduct(this.dialogData.productId || '');
      this.isEditMode = true;
    } else {
      this.isViewMode = true;
    }
  }

  private loadProduct(id: string): void {
    super.startLoading();
    this.service
      .getProductById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.productForm.patchValue(response.data);
          } else {
            console.error('Error fetching product:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching product:', error);
        }
      });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      const product = {
        productId: this.isAddMode
          ? '00000000-0000-0000-0000-000000000000' : productData.productId,
        name: productData.name?.trim(),
        description: productData.description?.trim(),
        price: productData.price,
        stock: productData.stock
      };
      super.startLoading();

      this.service.createOrUpdateAsync(product)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.stopLoading())
        )
        .subscribe({
          next: (response) => {
            this.dialogRef.close(true);
            this.productForm.reset();

          },
          error: (error) => {
            console.error('Error creating product:', error);
          }
        });
    }
  }
}
