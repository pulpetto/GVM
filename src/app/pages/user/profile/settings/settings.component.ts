import { Component, inject } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { RouterModule } from '@angular/router';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [RouterModule, ActivityBarComponent],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
})
export class SettingsComponent {
    userService = inject(UserService);

    logout() {
        this.userService.logoutUser();
    }
}
