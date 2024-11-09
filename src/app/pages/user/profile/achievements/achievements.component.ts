import { Component, inject, OnInit } from '@angular/core';
import { AchievementComponent } from '../../../../shared/achievement/achievement.component';
import { DataService } from '../../../../services/data.service';
import { Observable } from 'rxjs';
import { Achievement } from '../../../../interfaces/achievement';
import { CommonModule } from '@angular/common';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';

@Component({
    selector: 'app-achievements',
    standalone: true,
    imports: [
        AchievementComponent,
        CommonModule,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
    ],
    templateUrl: './achievements.component.html',
    styleUrl: './achievements.component.css',
})
export class AchievementsComponent implements OnInit {
    dataService = inject(DataService);

    achievements$!: Observable<Achievement[]>;

    ngOnInit() {
        this.achievements$ = this.dataService.getAchievements();
    }
}
