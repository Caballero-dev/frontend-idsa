import { Component } from '@angular/core';
import { StyleClass } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [StyleClass],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  constructor(public layoutService: LayoutService) {}
}
