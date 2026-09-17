import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface UnsaveConfirmationData {
  message?: string;
}

@Component({
  selector: 'app-unsave-confirmation-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './unsave-confirmation-dialog.html',
  styleUrl: './unsave-confirmation-dialog.css',
})
export class UnsaveConfirmationDialog {

  readonly defaultMessage =
    'Are you sure you want to unsave this item?';

  readonly defaultConfirmText = 'Delete';
  readonly defaultCancelText = 'Cancel';

  constructor(
    private readonly dialogRef: MatDialogRef<UnsaveConfirmationData>,
    @Inject(MAT_DIALOG_DATA) public readonly data: UnsaveConfirmationData
  ) { }

  get message(): string {
    return this.data?.message || this.defaultMessage;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
