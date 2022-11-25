export interface Teacher {
  teacherId: number;
  teacherName: string;
  gradeId: string;
  phone: string;
  email: string;
  maxClassSize: number;
  students?: Object[];
}
