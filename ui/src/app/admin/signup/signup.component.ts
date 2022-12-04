import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AdminsService } from 'src/app/services/admins.service';
import { userExistsValidator } from '../userExistsValidator.directive';

@Component({
  selector: 'sr-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MessageService],
})
export class SignupComponent implements OnInit {
  @Input() showDialog!: boolean;
  @Output() closeDialog = new EventEmitter<any>();

  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private msgSvc: MessageService,
    private adminSvc: AdminsService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: [null, Validators.required],
      username: [null, { validators: Validators.required, asyncValidators: [userExistsValidator(this.adminSvc)], updateOn: 'blur' }],
      password: [null, Validators.required],
    });
  }

  createAccount(formValues: any) {
    this.adminSvc.createAccount(formValues).subscribe({
      next: res => {
        console.log(res);
        this.msgSvc.add({
          severity: 'success',
          summary: 'Success!',
          detail: `User ${res.username} successfully created!`
        });
        this.close();
      },
      error: err => {
        this.msgSvc.add({
          severity: 'error',
          summary: 'Error',
          detail: 'System error, please try again later.',
          sticky: true
        });
        console.error(err);
      },
      complete: () => {}
    });
  }

  close() {
    this.signupForm.reset();
    this.closeDialog.emit();
  }
}
