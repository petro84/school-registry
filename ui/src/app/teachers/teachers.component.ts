import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { faBookReader } from '@fortawesome/free-solid-svg-icons/faBookReader';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

import { Teacher } from '../models/teacher.model';
import { TeachersService } from '../services/teachers.service';
import { AdminsService } from '../services/admins.service';

@Component({
  selector: 'sr-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
  providers: [MessageService],
})
export class TeachersComponent implements OnInit {
  teachers!: Teacher[];
  adminLoggedIn: boolean = false;

  faBookReader = faBookReader;
  faChalkboardTeacher = faChalkboardTeacher;

  constructor(
    private teachersSvc: TeachersService,
    private router: Router,
    private route: ActivatedRoute,
    private msgSvc: MessageService,
    private adminsSvc: AdminsService
  ) {
    this.adminsSvc.admin.subscribe(
      (loggedIn) => (this.adminLoggedIn = !loggedIn.username)
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      const grade = pm.get('grade');
      const id = pm.get('id');

      if (grade) {
        this.teachersSvc
          .getTeachersByGrade(grade)
          .subscribe((teachers) => (this.teachers = teachers));
      } else if (id) {
        this.teachersSvc
          .getTeacherById(+id)
          .subscribe((teachers) => (this.teachers = [teachers]));
      } else {
        this.teachersSvc
          .getAllTeachers()
          .subscribe((teachers) => (this.teachers = teachers));
      }
    });
  }

  openTeacherInfo(teach: Teacher) {
    const id = teach.teacherId;
    const teacher = this.teachers.find((t) => t.teacherId === id);
    if (teacher) {
      this.teachersSvc.setTeacher(teacher);
      this.router.navigate(['/teacher', id]);
    } else {
      this.msgSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: `Teacher with id ${id} could not be found.`,
      });
    }
  }
}
