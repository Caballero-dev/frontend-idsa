export interface UserProfileResponse {
  userId: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  email: string;
  phone: string;
  roleName: string;
  key?: string | null;
  createdAt: string;
}
