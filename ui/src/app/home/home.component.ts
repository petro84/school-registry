import { Component, OnInit } from '@angular/core';

import { faBookReader } from '@fortawesome/free-solid-svg-icons';

import { Grade } from '../models/grade.model';
import { GradesService } from '../services/grades.service';

@Component({
  selector: 'sr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  grades!: Grade[];

  faBookReader = faBookReader;

  constructor(private gradesSvc: GradesService) {}

  ngOnInit(): void {
    this.gradesSvc.grades().subscribe((grades) => (this.grades = grades));
  }
}
