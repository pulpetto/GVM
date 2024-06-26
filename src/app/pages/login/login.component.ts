import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/input/input.component';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { Observable, of, debounceTime, switchMap, map, catchError } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [InputComponent, CommonModule, RouterModule],
})
export class LoginComponent {
    userService = inject(UserService);

    loginForm = new FormGroup({
        username: new FormControl('', {
            validators: [Validators.required],
            asyncValidators: [this.usernameValidator()],
            updateOn: 'blur',
        }),
        password: new FormControl('', {
            validators: [Validators.required],
            updateOn: 'blur',
        }),
    });

    usernameValidator(): AsyncValidatorFn {
        return (
            control: AbstractControl
        ): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }

            return of(control.value).pipe(
                debounceTime(300),
                switchMap((username) =>
                    this.userService.checkIfUserExists(username)
                ),
                map((exists) =>
                    exists ? null : { usernameDoesntExist: true }
                ),
                catchError((error) => {
                    console.error('Error checking username:', error);
                    return of({ serverError: true });
                })
            );
        };
    }

    loginUser(email: string, password: string) {
        this.userService.loginUser(email, password);
    }
}
