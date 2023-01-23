import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserLoggedService {
  private api = API_CONFIG;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    
    return this.http.get(`${this.api.baseUrl}/usuarios`, {
      params: {
        paginaAtual: 1,
        registrosPorPagina: 50
      }
    })
  }  
}
