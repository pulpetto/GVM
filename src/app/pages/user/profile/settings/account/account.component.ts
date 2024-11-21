import { Component } from '@angular/core';
import { ActivityBarComponent } from '../../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../../shared/previous-route-button/previous-route-button.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [ActivityBarComponent, PreviousRouteButtonComponent, CommonModule],
    templateUrl: './account.component.html',
    styleUrl: './account.component.css',
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
export class AccountComponent {
    modalVisibility: boolean = false;

    activeModalType!: 'pfp' | 'username' | 'password' | 'deletion';
    activeTitle: string = '';
    activeActionBtnName: string = '';

    openModal(
        modalType: 'pfp' | 'username' | 'password' | 'deletion',
        title: string,
        actionBtnName: string
    ) {
        this.modalVisibility = true;
        this.activeModalType = modalType;
        this.activeTitle = title;
        this.activeActionBtnName = actionBtnName;
    }
}
