import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Grade } from '../models/grade.model';
import { Teacher } from '../models/teacher.model';
import { GradesService } from '../services/grades.service';
import { TeachersService } from '../services/teachers.service';

@Component({
  selector: 'sr-teacher-student-form',
  templateUrl: './teacher-student-form.component.html',
  styleUrls: ['./teacher-student-form.component.css']
})
export class TeacherStudentFormComponent implements OnInit {

  @Input() formType!: string;
  @Output() onSave = new EventEmitter<FormGroup>();
  @Output() onClose = new EventEmitter();
  @Output() onRemove = new EventEmitter();

  form!:  FormGroup;
  grades!: Grade[];

  titles: string[] = ['Mr.', 'Mrs.', 'Ms.', 'Miss'];

  constructor(private fb: FormBuilder, private gradesSvc: GradesService, private teachersSvc: TeachersService) {
    this.gradesSvc.grades().subscribe(grades => this.grades = grades);
  }

  ngOnInit(): void {
    this.createForm();

    if (this.formType === 'teacher') {
      this.setupTeacherForm();
    } else if (this.formType === 'student') {
      console.log('Future Enhancement');
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
    this.form.addControl('classSize', new FormControl(0, [Validators.required, Validators.min(1), Validators.max(20)]));

    this.teachersSvc.teacher().subscribe(teacher => {
      if (teacher) {
        this.updateTeacherForm(teacher);
      }
    })
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
      classSize: teacher.maxClassSize
    });
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
