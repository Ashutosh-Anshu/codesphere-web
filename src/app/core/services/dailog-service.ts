import { Injectable, Type } from '@angular/core';
import { DeleteConfirmationDialog, UnsaveConfirmationData, UnsaveConfirmationDialog, UnsaveConfirmationResult } from '../../common';
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
      autoFocus: options?.autoFocus ?? false,
      panelClass: options?.panelClass ?? 'app-dialog',
      disableClose: options?.disableClose ?? true,
      width: options?.width ?? '400px',
      maxWidth: options?.maxWidth ?? 'calc(100vw - 24px)',
      maxHeight: options?.maxHeight ?? 'calc(100vh - 24px)',
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
    message: string | null = null,
  ): MatDialogRef<DeleteConfirmationDialog, boolean> {

    return this.open<DeleteConfirmationDialog,
      { message: string | null }>(
        DeleteConfirmationDialog,
        {
          message
        },
        {
          width: '360px',
          maxWidth: 'calc(100vw - 8rem)',
          disableClose: true
        }
      );
  }

  openUnsavedConfirmation(message?: string)
    : MatDialogRef<UnsaveConfirmationDialog, UnsaveConfirmationResult> {
    return this.open<UnsaveConfirmationDialog, UnsaveConfirmationData>(
      UnsaveConfirmationDialog,
      {
        message
      },
      {
        width: '360px',
        maxWidth: 'calc(100vw - 8rem)',
        disableClose: true
      }
    );
  }
}
