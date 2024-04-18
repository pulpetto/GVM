import { Component } from '@angular/core';
import { InputComponent } from '../../shared/input/input.component';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [InputComponent],
})
export class LoginComponent {}
