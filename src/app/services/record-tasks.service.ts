import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RecordTasksService {
  private api = API_CONFIG;

  constructor(private http: HttpClient) {}

  getTasks(name): Observable<any> {
    return this.http.get<any>(`${this.api.baseUrl}/tarefas`, {
      params: {
        paginaAtual: 1,
        registrosPorPagina: 25,
        nomeUsuario: name,
      },
    });
  }

  getFilterName(name, data): Observable<any> {
    return this.http.get<any>(`${this.api.baseUrl}/registros-atividades`, {
      params: {
        paginaAtual: 1,
        registrosPorPagina: 25,
        nomeUsuario: name,
        dataInicio: data,
      },
    });
  }

  updateTasks(data): Observable<any> {
    return this.http.put<any>(`${this.api.baseUrl}/registros-atividades`, data);
  }

  deleteTask(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: `${id}`,
      },
    };
    return this.http.delete<any>(
      `${this.api.baseUrl}/registros-atividades`,
      options
    );
  }

  getTimerTask(id): Observable<any> {
    return this.http.post<any>(`${this.api.baseUrl}/tarefas`, {
      id: `${id}`,
    });
  }

  updateTimerTask(activity): Observable<any> {
    return this.http.put<any>(`${this.api.baseUrl}/tarefas`, {
      Tarefa: activity,
      Situacao: 2,
    });
  }

  doneTimerTask(activity): Observable<any> {
    return this.http.put<any>(`${this.api.baseUrl}/tarefas`, {
      Tarefa: activity,
      Situacao: 3,
    });
  }
}
