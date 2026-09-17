import { Injectable, Type } from '@angular/core';
import { DeleteConfirmationDialog } from '../../common';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface AppDialogOptions {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  panelClass?: string | string[];
  autoFocus?: boolean;
  disableClose?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  constructor(private readonly dialog: MatDialog) { }

  open<T, D = unknown>(
    component: Type<T>,
    data?: D,
    options?: AppDialogOptions
  ): MatDialogRef<T> {

    const config: MatDialogConfig<D> = {
      width: options?.width ?? 'var(--app-dialog-width)',
      height: options?.height ?? 'var(--app-dialog-height)',

      maxWidth: options?.maxWidth ?? 'var(--app-dialog-max-width)',
      maxHeight: options?.maxHeight ?? 'var(--app-dialog-max-height)',

      autoFocus: options?.autoFocus ?? false,
      panelClass: options?.panelClass ?? 'app-dialog',
      disableClose: options?.disableClose ?? true,
      data,
    };

    return this.dialog.open(component, config);
  }

  close<T>(
    dialogRef: MatDialogRef<T>,
    result?: unknown
  ): Observable<unknown> {

    dialogRef.close(result);
    return dialogRef.afterClosed();
  }

  openDeleteConfirmation(
    message: string = 'Are you sure you want to delete this product? This action cannot be undone.'
  ): MatDialogRef<DeleteConfirmationDialog, boolean> {

    return this.open<DeleteConfirmationDialog,
      { message: string | null }>(
        DeleteConfirmationDialog,
        {
          message
        },
        {
          width: '420px',
          maxWidth: 'calc(100vw - 4rem)',
          disableClose: true
        }
      );
  }
}
