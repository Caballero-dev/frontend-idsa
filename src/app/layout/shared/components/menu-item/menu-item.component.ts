import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'li[menu-item]',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RippleModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})
export class MenuItemComponent {
  @Input() item!: MenuItem;
}
