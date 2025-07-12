import { RoleResponse } from './role.model';

export interface UserResponse {
  userId: string;
  email: string;
  role: RoleResponse;
  name: string;
  firstSurname: string;
  secondSurname: string;
  key: string;
  phoneNumber: string;
  createdAt: string;
  isActive: boolean;
  isVerifiedEmail: boolean;
}

export interface UserRequest {
  role: RoleResponse;
  email: string;
  password?: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phoneNumber: string;
  key: string;
}
