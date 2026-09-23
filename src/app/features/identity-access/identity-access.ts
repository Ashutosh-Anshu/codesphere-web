import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '../../core/services';
import { Login } from './components/login/login';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-identity-access',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './identity-access.html',
  styleUrl: './identity-access.css',
})
export class IdentityAccess {


  private readonly dialog = inject(MatDialog);
  private readonly dialogService = inject(DialogService);
  login(): void {
    this.dialogService
      .open(Login, {})
      .afterClosed()
      .subscribe((result) => {
        if (result) {
        }
      });
  }
}
