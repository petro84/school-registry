import { Student } from './student.model';

export interface Teacher {
  avatar?: string;
  teacherId: number;
  teacherName: string;
  gradeId: string;
  phone: string;
  email: string;
  maxClassSize: number;
  students?: Student[];
}
