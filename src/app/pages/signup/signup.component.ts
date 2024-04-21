import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/input/input.component';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [InputComponent, ReactiveFormsModule, CommonModule],
})
export class SignupComponent implements OnInit {
    userService = inject(UserService);

    loading$!: Observable<boolean>;

    singupForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            this.passwordValidator.bind(this),
        ]),
        repeatPassword: new FormControl('', [
            Validators.required,
            this.matchingPasswordValidator.bind(this),
        ]),
    });

    ngOnInit() {
        this.loading$ = this.userService.getLoadingState$();
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
