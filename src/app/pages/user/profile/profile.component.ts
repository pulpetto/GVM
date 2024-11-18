import { Component, computed, inject } from '@angular/core';
import { IconButtonComponent } from '../../../shared/icon-button/icon-button.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { RouterModule } from '@angular/router';
import { ActivityBarComponent } from '../../../shared/activity-bar/activity-bar.component';
import { animate, style, transition, trigger } from '@angular/animations';

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const timing = '0.3s cubic-bezier(0.4, 0, 0.2, 1)';

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
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
    ],
})
export class ProfileComponent {
    userService = inject(UserService);

    userRole = computed(() => this.userService.getUser()?.role);
    proPlan = computed(() => this.userService.getUser()?.pro);

    pfpFullView: boolean = true;
}
