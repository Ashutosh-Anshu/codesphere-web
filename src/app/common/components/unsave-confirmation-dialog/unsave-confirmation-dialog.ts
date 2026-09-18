import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface UnsaveConfirmationData {
  message?: string;
}

export type UnsaveConfirmationResult =
  | 'cancel'
  | 'discard'
  | 'save';

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
    'You have unsaved changes. What would you like to do?';

  constructor(
    private readonly dialogRef
      : MatDialogRef<UnsaveConfirmationData, UnsaveConfirmationResult>,
    @Inject(MAT_DIALOG_DATA) public readonly data: UnsaveConfirmationData
  ) { }

  get message(): string {
    return this.data?.message || this.defaultMessage;
  }

  cancel(): void {
    this.dialogRef.close('cancel');
  }

  discard(): void {
    this.dialogRef.close('discard');
  }

  save(): void {
    this.dialogRef.close('save');
  }
}
