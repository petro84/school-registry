import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';

import { GradesService } from './services/grades.service';

export let browserRefresh = false;

@Component({
  selector: 'sr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  browserSub!: Subscription;

  constructor(
    private primengConfig: PrimeNGConfig,
    private gradesSvc: GradesService,
    private router: Router
  ) {
    this.browserSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    })
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.gradesSvc
      .getGrades()
      .subscribe((grades) => this.gradesSvc.setGrades(grades));
  }

  ngOnDestroy(): void {
    this.browserSub.unsubscribe();
  }
}
