import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';

interface MenuItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ButtonModule, Ripple, AvatarModule, RouterLink, MenuItemComponent],
  styleUrl: './sidebar.component.css',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  menuItem: MenuItem[] = [
    { label: 'Inicio', icon: 'pi pi-home', path: './inicio' },
    { label: 'Alumnos', icon: 'pi pi-users', path: './alumnos' },
    { label: 'Usuarios', icon: 'pi pi-users', path: './usuarios' },
    { label: 'ejemplo', icon: 'pi pi-book', path: './ejemplo' },
  ];

  constructor() {}

  ngOnInit() {}
}
