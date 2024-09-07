import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/input/input.component';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { CredentialsModalComponent } from '../../shared/credentials-modal/credentials-modal.component';

@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [
        InputComponent,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        CredentialsModalComponent,
    ],
})
export class SignupComponent implements OnInit {
    userService = inject(UserService);

    loading$!: Observable<boolean>;

    singupForm = new FormGroup({
        username: new FormControl('', {
            validators: [Validators.required],
            asyncValidators: [this.usernameAsyncValidator()],
            updateOn: 'blur',
        }),
        email: new FormControl('', {
            validators: [Validators.required, Validators.email],
            asyncValidators: [this.emailValidator()],
            updateOn: 'blur',
        }),
        password: new FormControl('', [
            Validators.required,
            this.passwordValidator.bind(this),
        ]),
        repeatPassword: new FormControl('', {
            validators: [
                Validators.required,
                this.matchingPasswordValidator.bind(this),
            ],
            updateOn: 'blur',
        }),
    });

    ngOnInit() {
        this.loading$ = this.userService.getLoadingState$();
    }

    usernameAsyncValidator(): AsyncValidatorFn {
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
                    exists ? { usernameAlreadyTaken: true } : null
                ),
                catchError((error) => {
                    console.error('Error checking username:', error);
                    return of({ serverError: true });
                })
            );
        };
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
                map((exists) => (exists ? { emailAlreadyTaken: true } : null)),
                catchError((error) => {
                    console.error('Error checking email:', error);
                    return of({ serverError: true });
                })
            );
        };
    }

    passwordValidator(control: AbstractControl): ValidationErrors | null {
        const value: string = control.value;

        if (!/[A-Z]/.test(value)) {
            return { uppercaseLetterMissing: true };
        }

        if (!/[a-z]/.test(value)) {
            return { lowercaseLetterMissing: true };
        }

        if (!/[0-9]/.test(value)) {
            return { numberMissing: true };
        }

        if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/.test(value)) {
            return {
                symbolMissing: true,
            };
        }

        if (value.length < 8) {
            return { passwordTooShort: true };
        }

        return null;
    }

    matchingPasswordValidator(
        control: AbstractControl
    ): ValidationErrors | null {
        const password = this.singupForm?.value.password;
        const repeatPassword = control.value;

        if (password !== repeatPassword) {
            return { passwordsDoNotMatch: true };
        }

        return null;
    }

    signupUser() {
        this.userService.signupUser({
            username: this.singupForm.value.username!,
            email: this.singupForm.value.email!,
            password: this.singupForm.value.password!,
        });
    }
}
