import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';

import { Student } from '../models/student.model';
import { Teacher } from '../models/teacher.model';
import { TeachersService } from '../services/teachers.service';

@Component({
  selector: 'sr-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [MessageService],
})
export class StudentsComponent implements OnInit {
  teacher!: Teacher;
  students!: Student[];
  student!: Student;

  faBookReader = faBookReader;

  get teacherName() {
    if (this.teacher) {
      let name = this.teacher.teacherName.split(' ');
      return `${name[0]} ${name[2]}`;
    } else {
      return '';
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teachersSvc: TeachersService,
    private msgSvc: MessageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');

      if (id) {
        this.teachersSvc.getTeacherById(+id).subscribe((teacher) => {
          this.teacher = teacher;
          this.students = teacher.students ? teacher.students : [];
        });
      }
    });
  }

  openStudentInfo(id: number) {
    const student = this.students.find((s) => s.studentId === id);
    if (student) {
      this.router.navigate([
        '/teacher',
        this.teacher.teacherId,
        'student',
        student.studentId,
      ]);
    } else {
      this.msgSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: `Student with id ${id} could not be faPoundSign.`,
      });
    }
  }

  clearTeacher$() {
    this.teachersSvc.setTeacher(null);
  }

  registStudent() {
    this.clearTeacher$();
    this.router.navigate(['/student']);
  }

  goHome() {
    this.clearTeacher$();
    this.router.navigate(['/']);
  }
}
