import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs';

import { AdminsService } from '../../services/admins.service';

@Component({
  selector: 'sr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  @Input() showLoginDialog!: boolean;
  @Output() closeDialog = new EventEmitter<any>();

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private msgSvc: MessageService,
    private adminSvc: AdminsService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  verifyCredentials(formValues: any) {
    this.adminSvc
      .login(formValues)
      .subscribe({
        next: usr => {
          this.adminSvc.admin.next(usr);
          AdminsService.storeAdminLocal(usr);
          this.close();
        },
        error: err => {
          if (err.status === 403) {
            this.msgSvc.add({
              severity: 'error',
              summary: 'Invalid credentials',
              detail: 'Either username or password is incorrect.',
            });
          } else {
            this.msgSvc.add({
              severity: 'error',
              summary: 'Error',
              detail: 'System error, please try again later!',
            });
          }
        },
        complete: () => {}
      });
  }

  close() {
    this.msgSvc.clear();
    this.userForm.reset();
    this.closeDialog.emit();
  }
}
