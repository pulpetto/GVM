import { Component, inject } from '@angular/core';
import { InputComponent } from '../../shared/input/input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [InputComponent],
})
export class LoginComponent {
    userService = inject(UserService);

    singupForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });
}
