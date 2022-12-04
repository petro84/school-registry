import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

import { faSchool } from '@fortawesome/free-solid-svg-icons/faSchool';

import { Grade } from '../models/grade.model';
import { GradesService } from '../services/grades.service';
import { AdminsService } from '../services/admins.service';
import { Admin } from '../models/admin.model';

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

  faSchool = faSchool;

  constructor(private gradesSvc: GradesService, private adminSvc: AdminsService) {}

  ngOnInit(): void {
    this.gradeSub = this.gradesSvc.grades().subscribe((grades) => {
      this.grades = grades;
      this.setMenuItems();
    });

    this.adminSvc.admin.subscribe(user => this.currentAdmin = user);
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
  }

  ngOnDestroy(): void {
    if (this.gradeSub) {
      this.gradeSub.unsubscribe();
    }
  }
}
