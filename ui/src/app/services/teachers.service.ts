import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  private teachersUrl = 'http://localhost:8085/api/teachers';
  private teachers$ = new BehaviorSubject<Teacher | null>(null);

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) { }

  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.teachersUrl);
  }

  getTeachersByGrade(grade: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.teachersUrl}/bygrade/${grade}`)
  }
}
