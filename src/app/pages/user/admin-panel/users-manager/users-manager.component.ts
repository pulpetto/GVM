import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../../../interfaces/user';
import { animate, style, transition, trigger } from '@angular/animations';

const visibleModal = { top: '50%' };
const visibleModal75 = { top: '75%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-users-manager',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './users-manager.component.html',
    styleUrl: './users-manager.component.css',
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
        trigger('openClose4', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModal75)),
            ]),
            transition(':leave', [
                style(visibleModal75),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
    ],
})
export class UsersManagerComponent implements OnInit {
    adminService = inject(AdminService);

    roleSelectorModalVisibility: boolean = false;
    activeRole: 'regular user' | 'trainer' | 'admin' = 'regular user';

    userDetailsModalVisibility: boolean = false;
    currentUserDetails!: User;

    users$!: Observable<User[]>;

    ngOnInit() {
        this.users$ = this.adminService.getUsers$();
    }

    changeActiveRole(activeRole: string) {
        this.activeRole = activeRole as 'regular user' | 'trainer' | 'admin';
        this.roleSelectorModalVisibility = false;
    }

    openUserDetailsModal(user: User) {
        this.currentUserDetails = user;
        this.userDetailsModalVisibility = true;
    }
}
