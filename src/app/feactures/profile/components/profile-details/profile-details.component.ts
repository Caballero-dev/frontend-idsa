import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Card, CardModule } from 'primeng/card';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css',
})
export class ProfileDetailsComponent {}
