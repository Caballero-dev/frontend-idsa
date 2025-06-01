import { Role } from '../../../core/models/Role.enum';

export interface UserProfileResponse {
  userId: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  email: string;
  phone: string;
  roleName: Role;
  key: string | null;
  createdAt: string;
}
