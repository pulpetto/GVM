import { Component, inject } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { RouterModule } from '@angular/router';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [RouterModule, ActivityBarComponent, CommonModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModal)),
            ]),
            transition(':leave', [
                style(visibleModal),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose2', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
        trigger('openClose3', [
            transition(':enter', [
                style(hiddenBtnFixed),
                animate(timing, style(visibleBtnFixed)),
            ]),
            transition(':leave', [
                style(visibleBtnFixed),
                animate(timing, style(hiddenBtnFixed)),
            ]),
        ]),
    ],
})
export class SettingsComponent {
    userService = inject(UserService);

    themeModalVisibility: boolean = true;

    logout() {
        this.userService.logoutUser();
    }
}
