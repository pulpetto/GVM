import { Component } from '@angular/core';
import { InputComponent } from '../../shared/input/input.component';

@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [InputComponent],
})
export class SignupComponent {}
