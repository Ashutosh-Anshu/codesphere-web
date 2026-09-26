import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-user-detail',
  imports: [MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    ReactiveFormsModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail {

  private readonly dialogRef = inject(MatDialogRef<UserDetail>);

  close(): void {
    this.dialogRef.close(false);
  }

  roles = [
    {
      id: 'SUPER_ADMIN',
      name: 'Super Admin'
    },
    {
      id: 'ADMIN',
      name: 'Administrator'
    },
    {
      id: 'MANAGER',
      name: 'Manager'
    },
    {
      id: 'SUPERVISOR',
      name: 'Supervisor'
    },
    {
      id: 'HR',
      name: 'HR'
    },
    {
      id: 'FINANCE',
      name: 'Finance'
    },
    {
      id: 'IT_SUPPORT',
      name: 'IT Support'
    },
    {
      id: 'USER',
      name: 'User'
    },
    {
      id: 'VIEWER',
      name: 'Viewer'
    }
  ];

}
