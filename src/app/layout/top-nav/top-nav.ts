import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BaseDetailService, DialogService, UserService } from '../../core/services';
import { Login } from '../../features/login/login';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav extends BaseDetailService {

  constructor() {
    super();
  }

  @Input() isDarkMode = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();


  private readonly dialogService = inject(DialogService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  login() {
    this.dialogService
      .open(Login)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.isLoggedIn.set(true);
        } else {
          console.log('Login canceled or failed');
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.userService.refreshMenus();
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }


}