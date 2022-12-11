import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, take } from 'rxjs';

import { Grade } from '../models/grade.model';
import { Student } from '../models/student.model';
import { Teacher } from '../models/teacher.model';
import { AdminsService } from '../services/admins.service';
import { GradesService } from '../services/grades.service';
import { StudentsService } from '../services/students.service';
import { TeachersService } from '../services/teachers.service';

@Component({
  selector: 'sr-teacher-student-form',
  templateUrl: './teacher-student-form.component.html',
  styleUrls: ['./teacher-student-form.component.css'],
})
export class TeacherStudentFormComponent implements OnInit {
  @Input() formType!: string;
  @Output() onSave = new EventEmitter<FormGroup>();
  @Output() onClose = new EventEmitter();
  @Output() onRemove = new EventEmitter();

  form!: FormGroup;
  grades!: Grade[];
  bypassStudentLoad!: boolean;
  currentGrade!: Grade;
  displayEditor: boolean = false;
  adminLoggedIn: boolean = false;
  windowWidth!: number;

  titles: string[] = ['Mr.', 'Mrs.', 'Ms.', 'Miss'];

  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }

  constructor(
    private fb: FormBuilder,
    private gradesSvc: GradesService,
    private teachersSvc: TeachersService,
    private studentsSvc: StudentsService,
    private adminsSvc: AdminsService,
    private route: ActivatedRoute
  ) {
    this.gradesSvc.grades().subscribe((grades) => (this.grades = grades));

    this.route.paramMap.subscribe((pm) => {
      this.bypassStudentLoad = !Boolean(pm.get('id') && pm.get('sId'));
    });

    this.adminsSvc.admin.subscribe(
      (admin) => (this.adminLoggedIn = !admin.username)
    );
  }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.createForm();

    if (this.formType === 'teacher') {
      this.setupTeacherForm();
    } else if (this.formType === 'student') {
      this.setupStudentForm();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      avatar: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      grade: [null, Validators.required],
      phone: [null, [Validators.required, Validators.minLength(10)]],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  setupTeacherForm() {
    this.form.addControl('title', new FormControl(null, Validators.required));
    this.form.addControl(
      'classSize',
      new FormControl(0, [
        Validators.required,
        Validators.min(1),
        Validators.max(20),
      ])
    );

    this.teachersSvc.teacher().subscribe((teacher) => {
      if (teacher) {
        this.updateTeacherForm(teacher);
      }
    });
  }

  updateTeacherForm(teacher: Teacher) {
    const name: string[] = teacher.teacherName.split(' ');

    this.form.patchValue({
      title: name[0],
      firstName: name[1],
      lastName: name[2],
      phone: teacher.phone,
      email: teacher.email,
      grade: teacher.gradeId,
      classSize: teacher.maxClassSize,
      avatar: teacher.avatar
    });
  }

  setupStudentForm() {
    this.form.addControl('teacher', new FormControl(null));

    forkJoin({
      student: this.studentsSvc.student().pipe(take(1)),
      teacher: this.teachersSvc.teacher().pipe(take(1)),
    }).subscribe((data) => {
      if (data.student && data.teacher) {
        this.updateStudentForm(data.student, data.teacher);
      } else if (!this.bypassStudentLoad) {
        console.error('Either student or teacher is null');
      }
    });
  }

  updateStudentForm(student: Student, teacher: Teacher) {
    const name: string[] = student.studentName.split(' ');

    this.grades.find((g) => {
      if (g.gradeId === teacher.gradeId) {
        this.currentGrade = g;
      }
    });

    this.form.patchValue({
      firstName: name[0],
      lastName: name[1],
      phone: student.phone,
      email: student.email,
      teacher: teacher.teacherName,
      grade: teacher.gradeId,
      avatar: student.avatar
    });

    if (this.adminLoggedIn) {
      this.form.controls['grade'].disable();
    } else {
      this.form.controls['grade'].enable();
    }
  }

  resetTeacher(event: any) {
    if (this.formType === 'student') {
      let changedGrade = <Grade>event;

      if (changedGrade) {
        if (this.currentGrade?.gradeId !== changedGrade.gradeId) {
          this.form.patchValue({
            teacher: null,
          });
        }
      }
    }
  }

  updatePic(event: string) {
    if (event) {
      this.form.patchValue({
        avatar: event
      });
    }
  }

  onSubmit(formValues: any) {
    this.onSave.emit(formValues);
  }

  onCancel() {
    this.onClose.emit();
  }

  onDelete() {
    this.onRemove.emit();
  }
}
