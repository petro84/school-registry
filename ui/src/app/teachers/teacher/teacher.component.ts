import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Teacher } from '../../models/teacher.model';
import { TeachersService } from '../../services/teachers.service';

@Component({
  selector: 'sr-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  teacher!: Teacher | null;
  teacherId!: number;

  constructor(
    private teachersSvc: TeachersService,
    private router: Router,
    private msgSvc: MessageService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');

      if (id) {
        this.teacherId = +id;
      }
    });
  }

  ngOnInit(): void {
    if (this.teacherId) {
      this.teachersSvc.getTeacherById(this.teacherId).subscribe((teacher) => {
        this.teacher = teacher;
        this.teachersSvc.setTeacher(teacher);
      });
    } else if (!this.teacherId) {
      this.teachersSvc.teacher().subscribe((teacher) => {
        if (teacher) {
          this.teacher = teacher;
        }
      });
    }
  }

  save(formValues: any) {
    const teacher: Teacher = {
      avatar: formValues['avatar'],
      teacherId: this.teacher?.teacherId ? this.teacher.teacherId : 0,
      teacherName: `${formValues['title']} ${formValues['firstName']} ${formValues['lastName']}`,
      gradeId: formValues['grade'],
      phone: formValues['phone'],
      email: formValues['email'],
      maxClassSize: formValues['classSize'],
    };

    if (!this.teacher) {
      this.teachersSvc.createTeacher(teacher).subscribe({
        next: () =>
          this.createToastMsg(
            'success',
            'Success!',
            `${teacher.teacherName} has been created!`,
            false
          ),
        error: (err) => {
          this.createToastMsg(
            'error',
            'Error',
            `Unable to create ${teacher.teacherName} profile.`,
            true
          );
          console.error(err);
        },
        complete: () => {},
      });
    } else {
      this.teachersSvc.updateTeacher(teacher).subscribe({
        next: () =>
          this.createToastMsg(
            'success',
            'Success!',
            `${teacher.teacherName} has been updated!`,
            false
          ),
        error: (err) => {
          this.createToastMsg(
            'error',
            'Error',
            `System error, unable to update ${teacher.teacherName}'s profile.`,
            true
          );
          console.error(err);
        },
        complete: () => {},
      });
    }
  }

  confirmDelete() {
    this.msgSvc.clear();
    this.msgSvc.add({
      key: 'center',
      sticky: true,
      severity: 'warn',
      summary: 'Delete Teacher?',
      detail: `Please confirm that you would like to delete ${this.teacher?.teacherName}`,
    });
  }

  deleteCancelled() {
    this.msgSvc.clear();
  }

  deleteTeacher() {
    this.msgSvc.clear('center');

    if (this.teacher && this.teacherId && this.teacherId === this.teacherId) {
      this.teachersSvc.deleteTeacher(this.teacherId).subscribe({
        next: () =>
          this.createToastMsg(
            'success',
            'Success!',
            `${this.teacher?.teacherName} has been removed.`,
            false
          ),
        error: (err) => {
          this.createToastMsg(
            'error',
            'Error',
            `Unable to remove ${this.teacher?.teacherName}. Try again.`,
            true
          );
          console.error(err);
        },
        complete: () => {},
      });
    } else {
      this.createToastMsg('error', 'Error', 'Teacher does not exist.', true);
    }
  }

  closeForm() {
    this.teachersSvc.setTeacher(null);
    this.router.navigate(['/teachers']);
  }

  createToastMsg(
    severity: string,
    summary: string,
    detail: string,
    isError: boolean
  ) {
    this.msgSvc.add({ severity, summary, detail });

    if (!isError) {
      setTimeout(() => this.closeForm(), 3000);
    }
  }
}
