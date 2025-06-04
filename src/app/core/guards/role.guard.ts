import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ProfileService } from '../../feactures/profile/services/profile.service';
import { Role } from '../models/Role.enum';

export const roleGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  const profile = profileService.profile();
  if (!profile) {
    router.navigate(['/panel/inicio']);
    return false;
  }

  const requiredRole = route.data['role'] as Role;

  if (requiredRole === profile.roleName) {
    return true;
  }

  router.navigate(['/panel/inicio']);
  return false;
};
