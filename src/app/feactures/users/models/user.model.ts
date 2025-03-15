export interface Role {
  roleId: string;
  roleName: string;
}

export interface User {
  userId: number;
  email: string;
  role: Role;
  name: string;
  firstSurname: string;
  secondSurname: string;
  key: string;
  phoneNumber: string;
  password?: string | null;
  createdAt: string;
  isActive: boolean;
}

export interface UserRequest {
  role: Role;
  email: string;
  password?: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phoneNumber: string;
  key: string;
}

export interface EmitterDialogUser {
  isOpen: boolean;
  message: string;
  user: User | null;
}
