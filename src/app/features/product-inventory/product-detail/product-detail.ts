import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ViewMode } from '../../../core/enums';
import { BaseDetailService, DialogService, ProductService } from '../../../core/services';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, filter } from 'rxjs';
import { Product } from '../../../core/models';
import * as _ from 'lodash';

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

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProductService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<ProductDetail>);

  public rawProductForm!: Product;

  productForm = this.fb.nonNullable.group({
    productId: [''],
    name: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    stock: [0, Validators.required],
  });

  ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {
    switch (this.dialogData.mode) {
      case ViewMode.Add:
        this.isAddMode = true;
        this.cloneDeep();
        break;

      case ViewMode.Edit:
        this.isEditMode = true;
        this.loadProduct(this.dialogData.productId ?? '');
        break;

      default:
        this.isViewMode = true;
        break;
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
            this.cloneDeep();
          } else {
            console.error(
              'Error fetching product:',
              response.message
            );
          }
        },
        error: (error) => {
          console.error('Error fetching product:', error);
        }
      });
  }

  private cloneDeep(): void {
    this.rawProductForm = _.cloneDeep(
      this.productForm.getRawValue()
    ) as Product;
  }

  private hasUnsavedChanges(): boolean {
    return !_.isEqual(
      this.rawProductForm,
      this.productForm.getRawValue()
    );
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (!this.hasUnsavedChanges()) {
      this.dialogRef.close(true);
      return;
    }

    const formValue = this.productForm.getRawValue();

    const product = {
      productId: this.isAddMode
        ? '00000000-0000-0000-0000-000000000000'
        : formValue.productId,
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      price: formValue.price,
      stock: formValue.stock
    };

    super.startLoading();

    this.service
      .createOrUpdateAsync(product)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            console.error(
              'Error saving product:',
              response.message
            );
          }
        },
        error: (error) => {
          console.error('Error saving product:', error);
        }
      });
  }

  close(): void {
    if (!this.hasUnsavedChanges()) {
      this.dialogRef.close(false);
      return;
    }

    this.confirmUnsavedChanges();
  }

  private confirmUnsavedChanges(): void {
    this.dialogService
      .openUnsavedConfirmation()
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => {
        switch (result) {
          case 'cancel':
            break;

          case 'discard':
            this.dialogRef.close(false);
            break;

          case 'save':
            this.saveProduct();
            break;
        }
      });
  }
}
