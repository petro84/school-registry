import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { concatMap } from 'rxjs';

import { Student } from '../../models/student.model';
import { Teacher } from '../../models/teacher.model';
import { StudentsService } from '../../services/students.service';
import { TeachersService } from '../../services/teachers.service';

@Component({
  selector: 'sr-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [MessageService],
})
export class StudentComponent implements OnInit {
  student!: Student | null;
  teachers!: Teacher[];
  teacherId!: number;
  studentId!: number;

  constructor(
    private teachersSvc: TeachersService,
    private studentsSvc: StudentsService,
    private msgSvc: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teachersSvc
      .getAllTeachers()
      .subscribe((teachers) => (this.teachers = teachers));
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data['resolver']) {
        this.studentsSvc.setStudent(data['resolver']['student']);
        this.teachersSvc.setTeacher(data['resolver']['teacher']);
        this.teacherId = data['resolver']['teacher'].teacherId;
        this.student = data['resolver']['student'];
      }
    });
  }

  save(formValues: any) {
    const student: Student = {
      studentId: this.student?.studentId ? this.student?.studentId : 0,
      studentName: `${formValues['firstName']} ${formValues['lastName']}`,
      phone: formValues['phone'],
      email: formValues['email'],
    };

    if (!this.student) {
      let teacher = this.getRandomTeacherByGrade(formValues['grade']);
      let teacherName = teacher.teacherName.split(' ');
      this.teacherId = teacher.teacherId;

      this.studentsSvc.createStudent(this.teacherId, student).subscribe({
        next: () =>
          this.createToastMsg(
            'success',
            'Success!',
            `${student.studentName} has been assigned to ${teacherName[0]} ${teacherName[2]}'s class.`,
            false
          ),
        error: (err) => {
          this.createToastMsg(
            'error',
            'Error',
            `Unable to register ${student.studentName} at this time. Please try again later.`,
            true
          );
          console.error(err);
        },
        complete: () => {},
      });
    } else if (this.student && !formValues['teacher']) {
      let teacher = this.getRandomTeacherByGrade(formValues['grade']);
      let sId = this.student?.studentId ? this.student.studentId : 0;

      const createStudent = this.studentsSvc.createStudent(
        teacher.teacherId,
        student
      );
      const deletePreviousStudent = createStudent.pipe(
        concatMap((teacher) =>
          this.studentsSvc.deleteStudent(this.teacherId, sId)
        )
      );

      deletePreviousStudent.subscribe({
        next: () => {
          let teacherName = teacher.teacherName.split(' ');
          this.createToastMsg(
            'success',
            'Success!',
            `${student.studentName} has been transfered to ${teacherName[0]} ${teacherName[2]}'s class.`,
            false
          );
        },
        error: (err) => {
          this.createToastMsg(
            'error',
            'Error',
            `System error, unable to modify ${student.studentName} at this time. Please try again later.`,
            true
          );
          console.error(err);
        },
      });
    } else {
      this.studentsSvc.updateStudent(this.teacherId, student).subscribe({
        next: () =>
          this.createToastMsg(
            'success',
            'Success!',
            `${student.studentName} has been updated.`,
            false
          ),
        error: (err) => {
          this.createToastMsg(
            'error',
            'Error',
            `System error, unable to update ${student.studentName} information.`,
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
      summary: 'Delete Student?',
      detail: `Please confirm that you would like to delete ${this.student?.studentName}`,
    });
  }

  deleteCancelled() {
    this.msgSvc.clear();
  }

  deleteStudent() {
    this.msgSvc.clear('center');
    let sId = this.student?.studentId ? this.student.studentId : 0;

    this.studentsSvc.deleteStudent(this.teacherId, sId).subscribe({
      next: () =>
        this.createToastMsg(
          'success',
          'Success!',
          `${this.student?.studentName} has been removed.`,
          false
        ),
      error: (err) => {
        this.createToastMsg(
          'error',
          'Error',
          `System error, unable to remove profile for ${this.student?.studentName}. Please try again later.`,
          true
        );
        console.error(err);
      },
      complete: () => {},
    });
  }

  closeForm() {
    this.studentsSvc.setStudent(null);
    if (this.teacherId) {
      this.router.navigate(['/students', this.teacherId]);
    } else {
      this.teachersSvc.setTeacher(null);
      this.router.navigate(['/']);
    }
  }

  getRandomTeacherByGrade(grade: string) {
    let teachersByGrade = this.teachers.filter(
      (teachers) => teachers.gradeId === grade
    );

    if (teachersByGrade.length > 1) {
      let randomNum = Math.floor(Math.random() * teachersByGrade.length);
      console.log(randomNum);
      return teachersByGrade[randomNum];
    } else {
      return teachersByGrade[0];
    }
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
