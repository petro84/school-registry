import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs';
import { AdminsService } from '../services/admins.service';

export function userExistsValidator(adminSvc: AdminsService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return adminSvc
      .usernameAvailable(control.value)
      .pipe(
        map((avail) => avail === 'NO' ? { userExists: true } : null)
      );
  };
}
