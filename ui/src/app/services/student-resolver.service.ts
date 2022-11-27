import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, forkJoin, Observable, of } from 'rxjs';

import { StudentsService } from './students.service';
import { TeachersService } from './teachers.service';

@Injectable({
  providedIn: 'root',
})
export class StudentResolverService implements Resolve<any> {
  constructor(
    private studentsSvc: StudentsService,
    private teachersSvc: TeachersService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    const sId = route.paramMap.get('sId');

    return forkJoin({
      student: this.studentsSvc.getStudent(route.params['id'], route.params['sId']),
      teacher: this.teachersSvc.getTeacherById(route.params['id'])
    }).pipe(catchError(() => of('Student does not exist!')));
  }
}
