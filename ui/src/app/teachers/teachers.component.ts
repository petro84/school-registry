import { Component, OnInit } from '@angular/core';

import { faBookReader } from '@fortawesome/free-solid-svg-icons/faBookReader';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { Teacher } from '../models/teacher.model';
import { TeachersService } from '../services/teachers.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sr-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
})
export class TeachersComponent implements OnInit {
  teachers!: Teacher[];

  faBookReader = faBookReader;
  faChalkboardTeacher = faChalkboardTeacher;

  constructor(
    private teachersSvc: TeachersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      const grade = pm.get('grade');

      if (grade) {
        this.teachersSvc
          .getTeachersByGrade(grade)
          .subscribe((teachers) => (this.teachers = teachers));
      } else {
        this.teachersSvc
          .getAllTeachers()
          .subscribe((teachers) => (this.teachers = teachers));
      }
    });
  }
}
