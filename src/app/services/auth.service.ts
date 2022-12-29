import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = API_CONFIG;

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  token(creds: any): Observable<any> {
    const ACCESS_TYPE = '94be650011cf412ca906fc335f615cdc';
    const GRANT_TYPE_LOGIN = 'password';

    return this.http.post(`${this.api.baseUrl}/login`, {
      access_type: ACCESS_TYPE,
      grant_type: GRANT_TYPE_LOGIN,
      usuario: creds.usuario,
      senha: creds.senha,
    });
  }

  isAuthenticated() {
    let token = localStorage.getItem('__authenticationToken__');

    if (token != null) return !this.jwtService.isTokenExpired(token);

    return false;
  }
}
