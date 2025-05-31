import { Component, HostListener, inject, OnInit } from '@angular/core';
import { LayoutService } from '../service/layout.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StyleClass } from 'primeng/styleclass';
import { AvatarModule } from 'primeng/avatar';
import { ProfileService } from '../../feactures/profile/services/profile.service';
import { AuthService } from '../../auth/services/auth.service';
import { ApiError } from '../../core/models/ApiError.model';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, StyleClass, AvatarModule, SpinnerComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  public profileService: ProfileService = inject(ProfileService);
  public layoutService = inject(LayoutService);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const session: { isValid: boolean; email?: string } = this.authService.isValidSession();

    if (!session.isValid || !session.email) {
      this.authService.logout();
      return;
    }

    this.profileService.getProfileByEmail(session.email).subscribe({
      error: (err: ApiError) => {
        if (err.statusCode === 404 && err.message.includes('user_not_found')) {
          this.authService.logout();
        }
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  getFullName(): string {
    return (
      this.profileService.profile()!.name +
      ' ' +
      this.profileService.profile()!.firstSurname +
      ' ' +
      this.profileService.profile()!.secondSurname
    );
  }

  getInitials(): string {
    const fullName = this.getFullName();
    const nameParts: string[] = fullName.split(' ');
    return nameParts.length >= 2 ? nameParts[0][0] + nameParts[1][0] : nameParts[0][0];
  }

  @HostListener('window:resize', ['$event'])
  isDesktop(): boolean {
    return !this.layoutService.isMobile();
  }
}
