import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  updateTasks(id, data): Observable<any> {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'PUT')
    .append('Access-Control-Allow-Origin', '*');
    let httpOptions = {
      headers: headers
    }
    return this.http.put<any>(`${this.api.baseUrl}/registros-atividades/${id}`, data, httpOptions)
  }

  deleteTask(id): Observable<any> {  
    const headers = new HttpHeaders().append('Content-Type', 'application/json')
   
    let httpOptions = {
      headers: headers
    }
    console.log(headers) 
     
    return this.http.delete<any>(`${this.api.baseUrl}/registros-atividades/${id}`, httpOptions)
  }
}
