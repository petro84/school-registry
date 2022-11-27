import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private baseUrl = 'http://localhost:8085/api/teachers';
  private student$ = new BehaviorSubject<Student | null>(null);

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  getStudent(teacherId: number, studentId: number): Observable<Student> {
    return this.http.get<Student>(
      `${this.baseUrl}/${teacherId}/students/${studentId}`
    );
  }

  createStudent(teacherId: number, student: Student): Observable<Student> {
    return this.http.post<Student>(
      `${this.baseUrl}/${teacherId}/students`,
      student,
      this.jsonContentTypeHeaders
    );
  }

  updateStudent(teacherId: number, student: Student): Observable<Student> {
    return this.http.put<Student>(
      `${this.baseUrl}/${teacherId}/students`,
      student,
      this.jsonContentTypeHeaders
    );
  }

  deleteStudent(teacherId: number, studentId: number) {
    return this.http.delete(
      `${this.baseUrl}/${teacherId}/students/${studentId}`
    );
  }

  setStudent(student: Student | null) {
    this.student$.next(student);
  }

  student(): Observable<Student | null> {
    return this.student$.asObservable();
  }
}
