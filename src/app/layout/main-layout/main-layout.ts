import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { SideNav } from '../side-nav/side-nav';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, TopNav, SideNav],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  sidebarOpened: boolean = false;
}
