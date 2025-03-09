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
  studentCode?: string;
  employeeCode?: string;
  password?: string;
  createdAt: string;
  isActive: boolean;
}
