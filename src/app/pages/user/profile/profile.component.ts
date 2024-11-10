import { Component, computed, inject } from '@angular/core';
import { IconButtonComponent } from '../../../shared/icon-button/icon-button.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { RouterModule } from '@angular/router';
import { ActivityBarComponent } from '../../../shared/activity-bar/activity-bar.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [
        IconButtonComponent,
        CommonModule,
        RouterModule,
        ActivityBarComponent,
    ],
})
export class ProfileComponent {
    userService = inject(UserService);

    userRole = computed(() => this.userService.getUser()?.role);
    proPlan = computed(() => this.userService.getUser()?.pro);
}
