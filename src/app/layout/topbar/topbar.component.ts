import { Component } from '@angular/core';
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
  constructor(public layoutService: LayoutService) {}
}
