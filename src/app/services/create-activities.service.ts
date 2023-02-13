import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CreateActivitiesService {
  private api = API_CONFIG;
  
  constructor(private http: HttpClient) { }

  createActivities(activity: any): Observable<any> {
    return this.http.post<any>(`${this.api.baseUrl}/registros-atividades`, activity)
  }
}
