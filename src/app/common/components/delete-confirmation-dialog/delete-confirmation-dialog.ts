import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface DeleteConfirmationData {
  message?: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './delete-confirmation-dialog.html',
  styleUrl: './delete-confirmation-dialog.css',
})
export class DeleteConfirmationDialog {
  readonly defaultTitle = 'Delete item';

  readonly defaultMessage =
    'Are you sure you want to delete this item?';

  readonly defaultConfirmText = 'Delete';
  readonly defaultCancelText = 'Cancel';

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public readonly data: DeleteConfirmationData
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
