import { Component, inject, OnInit } from '@angular/core';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';
import { Observable } from 'rxjs';
import { Achievement } from '../../../../interfaces/achievement';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';

const visibleModal = { top: '15%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-achievements-manager',
    standalone: true,
    imports: [
        ActivityBarComponent,
        PreviousRouteButtonComponent,
        CommonModule,
        RouterModule,
    ],
    templateUrl: './achievements-manager.component.html',
    styleUrl: './achievements-manager.component.css',
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
export class AchievementsManagerComponent implements OnInit {
    adminService = inject(AdminService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    achievements$!: Observable<Achievement[]>;

    ngOnInit() {
        this.achievements$ = this.adminService.getAchievements$();
    }

    redirectToAchievementRoute(data: Achievement) {
        this.router.navigate([data.id], {
            relativeTo: this.activatedRoute,
            state: { achievementData: data },
        });
    }
}
