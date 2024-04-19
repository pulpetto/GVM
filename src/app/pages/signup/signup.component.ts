import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../shared/input/input.component';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [InputComponent, ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
    form!: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required, Validators.email],
            password: ['', Validators.required],
            repeatPassword: ['', Validators.required],
        });
    }
}
