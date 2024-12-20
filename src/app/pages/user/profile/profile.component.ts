import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { RouterModule } from '@angular/router';
import { ActivityBarComponent } from '../../../shared/activity-bar/activity-bar.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { LinkButtonBigComponent } from '../../../shared/link-button-big/link-button-big.component';

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const timing = '0.3s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [
        CommonModule,
        RouterModule,
        ActivityBarComponent,
        LinkButtonBigComponent,
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

    userName = computed(() => this.userService.getUser()?.username);
    userRole = computed(() => this.userService.getUser()?.role);
    userPfp = computed(() => this.userService.getUser()?.pfpUrl);
    proPlan = computed(() => this.userService.getUser()?.pro);

    pfpFullView: boolean = false;
}
