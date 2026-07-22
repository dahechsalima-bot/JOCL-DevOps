import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Projet } from '../models/Projet';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addProject(projet: Projet): Observable<Projet> {
    const url = `${this.baseUrl}/addProject`;
    return this.http.post<Projet>(url, projet);
  }

  getProjects(): Observable<Projet>{
    const url = `${this.baseUrl}/getProjects`;
    return this.http.get<Projet>(url);
  }
  
  updateProjectStatus(id: number, newStatus: string): Observable<any> {
    const url = `${this.baseUrl}/updateProject/${id}/${newStatus}`;
    return this.http.put(url, {});
  }
  
  getProjetById(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get(url);
  }

}