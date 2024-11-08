import { Component, computed, inject } from '@angular/core';
import { IconButtonComponent } from '../../../shared/icon-button/icon-button.component';
import { CommonModule } from '@angular/common';
import { RecentComponent } from './recent/recent.component';
import { UserService } from '../../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [IconButtonComponent, CommonModule, RecentComponent, RouterModule],
})
export class ProfileComponent {
    userService = inject(UserService);

    userRole = computed(() => this.userService.getUser()?.role);
}
