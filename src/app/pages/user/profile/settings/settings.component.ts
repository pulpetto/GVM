import { Component, inject } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
})
export class SettingsComponent {
    userService = inject(UserService);

    logout() {
        this.userService.logoutUser();
    }
}
