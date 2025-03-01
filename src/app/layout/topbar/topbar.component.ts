import { Component, HostListener } from '@angular/core';
import { LayoutService } from '../service/layout.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StyleClass } from 'primeng/styleclass';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, StyleClass, AvatarModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  userName = 'John Doe Jr.';

  constructor(public layoutService: LayoutService) {}

  getInitials() {
    let name: string[] = this.userName.split(' ');
    return name[0][0] + name[1][0];
  }

  @HostListener('window:resize', ['$event'])
  isDesktop() {
    return !this.layoutService.isMobile();
  }
}
