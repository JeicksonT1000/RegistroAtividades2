import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RecordTasksService {
  private api = API_CONFIG;
   
  constructor(
    private http: HttpClient
  ) { }

  getTasks(name): Observable<any> {
    return this.http.get<any>(`${this.api.baseUrl}/tarefas`, {
      params: {
        paginaAtual: 1,
        registrosPorPagina: 25,
        nomeUsuario: name
      }
    })
  }

  getFilterName(name, data): Observable<any> {
    return this.http.get<any>(`${this.api.baseUrl}/registros-atividades`, {
      params: {
        paginaAtual: 1,
        registrosPorPagina: 25,
        nomeUsuario: name,
        dataInicio: data
      }
    })
  }
}
