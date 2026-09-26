import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule, RouterModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  identityAccessExpanded = false;

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 767px)')
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  toggle(): void {
    this.sidenav.toggle();
  }

  closeOnMobile(): void {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }
}
