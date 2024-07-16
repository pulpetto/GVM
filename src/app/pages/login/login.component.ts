import { Component, inject, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
    userService = inject(UserService);

    loading$!: Observable<boolean>;
    loginError$!: Observable<boolean>;

    loginForm = new FormGroup({
        email: new FormControl('', {
            validators: [Validators.required],
            asyncValidators: [this.emailValidator()],
            updateOn: 'blur',
        }),
        password: new FormControl('', {
            validators: [Validators.required],
        }),
    });

    ngOnInit() {
        this.loading$ = this.userService.getLoadingState$();
        this.loginError$ = this.userService.getErrorState$();
    }

    emailValidator(): AsyncValidatorFn {
        return (
            control: AbstractControl
        ): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }

            return of(control.value).pipe(
                debounceTime(300),
                switchMap((email) =>
                    this.userService.checkIfEmailIsRegistered(email)
                ),
                map((exists) => (exists ? null : { emailDoesntExist: true })),
                catchError((error) => {
                    console.error('Error checking email:', error);
                    return of({ serverError: true });
                })
            );
        };
    }

    loginUser() {
        this.userService.loginUser(
            this.loginForm.get('email')!.value!,
            this.loginForm.get('password')!.value!
        );
    }
}
