import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  role?: string;
}

export class JwtUtils {
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.log('Error al decodificar el token');
      return null;
    }
  }

  static getEmailFromToken(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken?.sub || null;
  }
}
