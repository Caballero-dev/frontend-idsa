import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule, RippleModule],
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  menuItem: MenuItem[] = [
    { label: 'Inicio', icon: 'pi pi-home', routerLink: './inicio' },
    { label: 'Tutores', icon: 'pi pi-book', routerLink: './tutores' },
    { label: 'Alumnos', icon: 'pi pi-graduation-cap', routerLink: './alumnos' },
    { label: 'Usuarios', icon: 'pi pi-users', routerLink: './usuarios' },
    { label: 'Mi perfil', icon: 'pi pi-user', routerLink: './perfil', separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', routerLink: '/auth/login' },
  ];
}
