import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  user: Admin = {
    username: '',
    password: '',
    name: '',
    id: 0,
  };

  admin: ReplaySubject<Admin> = new ReplaySubject<Admin>(1);

  private baseUrl: string = 'http://localhost:8085/api/admin';

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user')!);
      this.admin.next(user);
    } else {
      this.admin.next(this.user);
    }
  }

  login(user: Admin): Observable<Admin> {
    return this.http.post<Admin>(
      `${this.baseUrl}/login`,
      user,
      this.jsonContentTypeHeaders
    );
  }

  usernameAvailable(username: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/isAvailable/${username}`);
  }

  createAccount(user: Admin): Observable<Admin> {
    return this.http.post<Admin>(
      this.baseUrl,
      user,
      this.jsonContentTypeHeaders
    );
  }

  logout() {
    localStorage.clear();
    this.admin.next(this.user);
  }

  static storeAdminLocal(user: Admin) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
