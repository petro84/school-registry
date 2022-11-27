import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

import { faSchool } from '@fortawesome/free-solid-svg-icons/faSchool';

import { Grade } from '../models/grade.model';
import { GradesService } from '../services/grades.service';

@Component({
  selector: 'sr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  items!: MenuItem[];
  grades!: Grade[];
  gradeSub!: Subscription;

  faSchool = faSchool;

  constructor(private gradesSvc: GradesService) {}

  ngOnInit(): void {
    this.gradeSub = this.gradesSvc.grades().subscribe((grades) => {
      this.grades = grades;
      this.setMenuItems();
    });
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

  ngOnDestroy(): void {
    if (this.gradeSub) {
      this.gradeSub.unsubscribe();
    }
  }
}
