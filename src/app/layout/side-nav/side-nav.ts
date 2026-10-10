import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BaseDetailService, UserService } from '../../core/services';
import { Menu } from '../../core/models';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule, RouterModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav extends BaseDetailService implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  private readonly userService = inject(UserService);
  public readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  readonly menus = signal<Menu[]>([]);
  identityAccessExpanded = false;
  isMobile = false;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    super();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 767px)')
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    const menusData = sessionStorage.getItem('menus');

    if (menusData) {
      try {
        this.menus.set(JSON.parse(menusData));
      } catch {
        sessionStorage.removeItem('menus');
      }
    }

    this.userService.refreshMenus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadMenus());

    if (!sessionStorage.getItem('menus')) {
      this.loadMenus();
    }
  }

  toggle(): void {
    this.sidenav.toggle();
  }

  closeOnMobile(): void {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

  loadMenus(): void {
    const userData = sessionStorage.getItem('user');

    if (!userData) {
      this.menus.set([]);
      return;
    }

    let user: any;

    try {
      user = JSON.parse(userData);
    } catch {
      this.menus.set([]);
      return;
    }

    if (!user?.userId) {
      this.menus.set([]);
      return;
    }

    this.userService
      .getMenusByUserId(user.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.menus.set(response.data);
            sessionStorage.setItem(
              'menus',
              JSON.stringify(response.data)
            );
          }
        },
        error: (error) => {
          console.error('Failed to load menus:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}