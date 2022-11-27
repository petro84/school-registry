import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Grade } from '../models/grade.model';

@Injectable({
  providedIn: 'root',
})
export class GradesService {
  private gradesUrl: string = 'http://localhost:8085/api/grades';
  private grades$ = new BehaviorSubject<Grade[]>([]);

  constructor(private http: HttpClient) {}

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.gradesUrl);
  }

  setGrades(grades: Grade[]) {
    return this.grades$.next(grades);
  }

  grades(): Observable<Grade[]> {
    return this.grades$.asObservable();
  }
}
