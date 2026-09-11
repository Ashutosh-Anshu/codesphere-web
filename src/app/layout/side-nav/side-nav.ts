import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [
    MatSidenavModule,
    MatIconModule,
    RouterModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;

  ngAfterViewInit() {
    this.checkScreenSize();

    window.addEventListener(
      'resize',
      () => this.checkScreenSize()
    );
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.sidenav && this.isMobile) {
      this.sidenav.close();
    }
    else if (this.sidenav) {
      this.sidenav.open();
    }
  }

  closeOnMobile() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }
  
  toggle() {
    this.sidenav.toggle();
  }

}
