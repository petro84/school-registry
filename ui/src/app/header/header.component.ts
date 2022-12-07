import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

import { faSchool } from '@fortawesome/free-solid-svg-icons/faSchool';

import { GradesService } from '../services/grades.service';
import { AdminsService } from '../services/admins.service';
import { Grade } from '../models/grade.model';
import { Admin } from '../models/admin.model';
import { Teacher } from '../models/teacher.model';
import { TeachersService } from '../services/teachers.service';

@Component({
  selector: 'sr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  items!: MenuItem[];
  grades!: Grade[];
  gradeSub!: Subscription;
  showLoginDialog: boolean = false;
  showSignupDialog: boolean = false;
  currentAdmin!: Admin;

  searchText!: string;
  teachers!: Teacher[];
  filteredTeachers!: Teacher[];

  faSchool = faSchool;

  constructor(
    private gradesSvc: GradesService,
    private adminSvc: AdminsService,
    private router: Router,
    private teachersSvc: TeachersService
  ) {
    this.teachersSvc
      .getAllTeachers()
      .subscribe((teachers) => (this.teachers = teachers));
  }

  ngOnInit(): void {
    this.gradeSub = this.gradesSvc.grades().subscribe((grades) => {
      this.grades = grades;
      this.setMenuItems();
    });

    this.adminSvc.admin.subscribe((user) => (this.currentAdmin = user));
  }

  setMenuItems() {
    this.items = [];
    this.grades.forEach((grade) => {
      let mi: MenuItem = {
        label: grade.description,
      };
      this.items.push(mi);
    });
  }

  search(event: any) {
    this.filteredTeachers = this.teachers.filter((teachers) =>
      teachers.teacherName.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  onSelect(value: any) {
    let teacher: Teacher = value;

    this.router.navigate(['/teachers', { id: teacher.teacherId }]);
    this.filteredTeachers = [];
    this.searchText = '';
  }

  showDialog(action: string) {
    if (action === 'login') {
      this.showLoginDialog = true;
    } else if (action === 'signup') {
      this.showSignupDialog = true;
    }
  }

  closeDialog(action: string) {
    if (action === 'login') {
      this.showLoginDialog = false;
    } else if (action === 'signup') {
      this.showSignupDialog = false;
    }
  }

  logout() {
    this.adminSvc.logout();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    if (this.gradeSub) {
      this.gradeSub.unsubscribe();
    }
  }
}
