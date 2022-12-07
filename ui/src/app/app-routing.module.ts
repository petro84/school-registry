import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StudentResolverService } from './services/student-resolver.service';
import { StudentComponent } from './students/student/student.component';
import { StudentsComponent } from './students/students.component';
import { TeacherComponent } from './teachers/teacher/teacher.component';
import { TeachersComponent } from './teachers/teachers.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'teachers/:grade', component: TeachersComponent },
  { path: 'teachers/:id', component: TeachersComponent },
  { path: 'teacher', component: TeacherComponent },
  { path: 'teacher/:id', component: TeacherComponent, pathMatch: 'full' },
  {
    path: 'teacher/:id/student/:sId',
    component: StudentComponent,
    resolve: { resolver: StudentResolverService },
  },
  { path: 'students/:id', component: StudentsComponent },
  { path: 'student', component: StudentComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
