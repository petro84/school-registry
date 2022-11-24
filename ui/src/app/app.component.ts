import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';
import { GradesService } from './services/grades.service';

@Component({
  selector: 'sr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private gradesSvc: GradesService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.gradesSvc
      .getGrades()
      .subscribe((grades) => this.gradesSvc.setGrades(grades));
  }
}
