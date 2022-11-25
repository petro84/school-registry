import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private teachersUrl = 'http://localhost:8085/api/teachers';
  private teachers$ = new BehaviorSubject<Teacher | null>(null);

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.teachersUrl);
  }

  getTeachersByGrade(grade: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.teachersUrl}/bygrade/${grade}`);
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.teachersUrl}/${id}`);
  }

  createTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(
      this.teachersUrl,
      teacher,
      this.jsonContentTypeHeaders
    );
  }

  updateTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(
      this.teachersUrl,
      teacher,
      this.jsonContentTypeHeaders
    );
  }

  deleteTeacher(id: number) {
    return this.http.delete(`${this.teachersUrl}/${id}`);
  }

  setTeacher(teacher: Teacher | null) {
    this.teachers$.next(teacher);
  }

  teacher(): Observable<Teacher | null> {
    return this.teachers$.asObservable();
  }
}
