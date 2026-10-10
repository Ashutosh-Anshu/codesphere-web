import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private readonly tokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  saveTokens(
    accessToken: string,
    refreshToken: string
  ): void {
    sessionStorage.setItem(this.tokenKey, accessToken);
    sessionStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('menus');
  }
}
