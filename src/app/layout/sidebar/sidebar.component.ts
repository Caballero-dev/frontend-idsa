import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../auth/services/auth.service';
import { ProfileService } from '../../feactures/profile/services/profile.service';
import { Role } from '../../core/models/Role.enum';

interface MenuItem {
  label: string;
  icon: string;
  routerLink?: string;
  onClick?: () => void;
  Roles: Role[];
  separator?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule, RippleModule],
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private authService: AuthService = inject(AuthService);
  public profileService: ProfileService = inject(ProfileService);

  menuItem: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: './inicio',
      Roles: [Role.ADMIN, Role.TUTOR],
    },
    {
      label: 'Tutores',
      icon: 'pi pi-book',
      routerLink: './tutores',
      Roles: [Role.ADMIN],
    },
    {
      label: 'Grupos',
      icon: 'pi pi-objects-column',
      routerLink: './grupos',
      Roles: [Role.ADMIN],
    },
    {
      label: 'Alumnos',
      icon: 'pi pi-graduation-cap',
      routerLink: './alumnos',
      Roles: [Role.ADMIN, Role.TUTOR],
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      routerLink: './usuarios',
      Roles: [Role.ADMIN],
    },
    {
      label: 'Mi perfil',
      icon: 'pi pi-user',
      routerLink: './perfil',
      separator: true,
      Roles: [Role.ADMIN, Role.TUTOR],
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      onClick: () => this.authService.logout(),
      Roles: [Role.ADMIN, Role.TUTOR],
    },
  ];
}
